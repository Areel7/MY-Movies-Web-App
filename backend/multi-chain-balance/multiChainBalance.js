// multiChainBalance.js (ESM, no API keys, full fallbacks + timeouts + logs)

import axios from "axios";
import { ethers } from "ethers";
import { Connection, PublicKey } from "@solana/web3.js";

// --- CommonJS libs: import default and destructure (ESM-safe) ---
import tronwebPkg from "tronweb";
const { TronWeb } = tronwebPkg;

import ripplePkg from "ripple-lib";
const { RippleAPI } = ripplePkg;

import cardanoWalletPkg from "cardano-wallet-js";
const { CardanoWasm } = cardanoWalletPkg;

/* -------------------------- CONFIG -------------------------- */
const DEBUG = process.env.DEBUG_MULTICHAIN === "1";
const TIMEOUT_MS = Number(process.env.MULTICHAIN_TIMEOUT_MS ?? 12000);
const AXIOS = axios.create({ timeout: TIMEOUT_MS });

const log = (...a) => {
  if (DEBUG) console.log(...a);
};
const withTimeout = (p, ms, where) =>
  Promise.race([
    p,
    new Promise((_, rej) =>
      setTimeout(() => rej(new Error(`Timeout after ${ms}ms (${where})`)), ms)
    ),
  ]);

/* -------------------------- ENDPOINTS -------------------------- */
const RPC = {
  ethereum: ["https://eth.llamarpc.com", "https://rpc.ankr.com/eth"],
  bsc: ["https://bsc-dataseed.binance.org/", "https://bsc-rpc.publicnode.com"],
  polygon: [
    "https://polygon-rpc.com",
    "https://rpc-mainnet.matic.quiknode.pro",
  ],
  solana: [
    "https://api.mainnet-beta.solana.com",
    "https://rpc.ankr.com/solana",
    "https://solana-api.projectserum.com",
  ],
  tronFullHosts: ["https://api.trongrid.io", "https://rpc.trongrid.io"],
  xrpWs: [
    "wss://xrplcluster.com",
    "wss://s1.ripple.com",
    "wss://s2.ripple.com",
  ],
  btcApi: [
    "https://blockstream.info/api/address/",
    "https://mempool.space/api/address/",
  ],
  ltcApiPrimary: [
    "https://sochain.com/api/v2/get_address_balance/LTC/",
    "https://chain.so/api/v2/get_address_balance/LTC/",
  ],
  ltcApiFallback: [
    "https://api.blockchair.com/litecoin/dashboards/address/",
    "https://api.blockcypher.com/v1/ltc/main/addrs/",
  ],
  // Cardano public (no key)
  cardanoKoios: [
    "https://api.koios.rest/api/v1/address_info?&_address=",
    // community mirror (if available); if it 404s we'll move on
    "https://koios.rest/api/v1/address_info?&_address=",
  ],
};

/* ------------------------ GENERIC FALLBACK HELPERS ------------------------ */
async function httpGetFallback(baseUrls, pathOrTail, opt = {}, name = "http") {
  let lastErr;
  for (const base of baseUrls) {
    const url =
      base.endsWith("/") || base.includes("?")
        ? `${base}${pathOrTail}`
        : `${base}/${pathOrTail}`;
    log(`🔎 ${name} → ${url}`);
    try {
      const res = await withTimeout(AXIOS.get(url, opt), TIMEOUT_MS, name);
      return res;
    } catch (e) {
      lastErr = e;
      console.warn(`⚠️ ${name} failed: ${url} — ${e?.message ?? e}`);
    }
  }
  throw lastErr ?? new Error(`${name} all endpoints failed`);
}

async function safeRpcCall(rpcs, fn, name = "rpc-call") {
  let lastErr;
  for (const url of rpcs) {
    log(`🔌 ${name} RPC → ${url}`);
    try {
      return await withTimeout(fn(url), TIMEOUT_MS, `${name} @ ${url}`);
    } catch (e) {
      lastErr = e;
      console.warn(`⚠️ ${name} failed: ${url} — ${e?.message ?? e}`);
    }
  }
  throw lastErr ?? new Error(`${name} all RPCs failed`);
}

async function wsFallback(servers, connectFn, name = "ws") {
  let lastErr;
  for (const server of servers) {
    log(`🔗 ${name} → ${server}`);
    try {
      return await withTimeout(
        connectFn(server),
        TIMEOUT_MS,
        `${name} @ ${server}`
      );
    } catch (e) {
      lastErr = e;
      console.warn(`⚠️ ${name} failed: ${server} — ${e?.message ?? e}`);
    }
  }
  throw lastErr ?? new Error(`${name} all WS endpoints failed`);
}

/* ------------------------ ETH / ERC20 ------------------------ */
async function getEthBalance(address) {
  try {
    const res = await safeRpcCall(
      RPC.ethereum,
      async (url) => {
        const provider = new ethers.JsonRpcProvider(url);
        const bal = await provider.getBalance(address);
        return ethers.formatEther(bal);
      },
      "eth.getBalance"
    );
    return `${res} ETH`;
  } catch (e) {
    return `Error: ${e?.message ?? e}`;
  }
}

async function getERC20Balance(address, tokenAddress, symbol) {
  const abi = [
    "function balanceOf(address owner) view returns (uint256)",
    "function decimals() view returns (uint8)",
  ];
  try {
    const res = await safeRpcCall(
      RPC.ethereum,
      async (url) => {
        const provider = new ethers.JsonRpcProvider(url);
        const contract = new ethers.Contract(tokenAddress, abi, provider);
        const [bal, dec] = await Promise.all([
          contract.balanceOf(address),
          contract.decimals(),
        ]);
        return ethers.formatUnits(bal, dec);
      },
      `erc20(${symbol})`
    );
    return `${res} ${symbol}`;
  } catch (e) {
    return `Error: ${e?.message ?? e}`;
  }
}

/* ------------------------ TRON / USDT TRC20 ------------------------ */
async function getTRC20Balance(address, tokenAddress, symbol) {
  for (const fullHost of RPC.tronFullHosts) {
    try {
      log(`🔌 tron.fullHost → ${fullHost}`);
      const tron = new TronWeb({ fullHost });

      const contract = await withTimeout(
        tron.contract().at(tokenAddress),
        TIMEOUT_MS,
        "tron.contract.at"
      );
      const [balanceRes, decimalsRes] = await withTimeout(
        Promise.allSettled([
          contract.balanceOf(address).call(),
          contract.decimals?.().call?.(),
        ]),
        TIMEOUT_MS,
        "tron.read"
      );

      if (balanceRes.status !== "fulfilled")
        throw balanceRes.reason ?? new Error("balanceOf failed");
      const raw = Number(balanceRes.value?.toString?.() ?? balanceRes.value);
      const dec =
        decimalsRes.status === "fulfilled" && decimalsRes.value != null
          ? Number(decimalsRes.value?.toString?.() ?? decimalsRes.value)
          : 6;
      return `${raw / 10 ** dec} ${symbol}`;
    } catch (e) {
      console.warn(
        `⚠️ tron failed @ ${fullHost}: ${e?.message ?? JSON.stringify(e)}`
      );
      // try next host
    }
  }
  return `Error: TRON all endpoints failed`;
}

/* ------------------------ BITCOIN ------------------------ */
async function getBitcoinBalance(address) {
  try {
    const res = await httpGetFallback(RPC.btcApi, address, {}, "btc.http");
    // Normalize response (Blockstream + Mempool use similar schema)
    const s = res.data?.chain_stats ?? res.data?.chain_stats;
    const funded = s?.funded_txo_sum ?? 0;
    const spent = s?.spent_txo_sum ?? 0;
    return `${(funded - spent) / 1e8} BTC`;
  } catch (e) {
    return `Error: ${e?.message ?? e}`;
  }
}

/* ------------------------ LITECOIN ------------------------ */
async function getLitecoinBalance(address) {
  // Primary (SoChain / Chain.so)
  for (const base of RPC.ltcApiPrimary) {
    try {
      log(`🔎 ltc.primary → ${base}${address}`);
      const res = await withTimeout(
        AXIOS.get(`${base}${address}`),
        TIMEOUT_MS,
        "ltc.primary"
      );
      const data = res.data?.data ?? res.data;
      const confirmed = data?.confirmed_balance ?? data?.balance;
      if (confirmed != null) return `${confirmed} LTC`;
    } catch (e) {
      console.warn(`⚠️ ltc primary failed @ ${base}: ${e?.message ?? e}`);
    }
  }

  // Fallback: Blockchair
  try {
    const res = await withTimeout(
      AXIOS.get(
        `https://api.blockchair.com/litecoin/dashboards/address/${address}`
      ),
      TIMEOUT_MS,
      "ltc.blockchair"
    );
    const node = res.data?.data?.[address]?.address;
    if (node?.balance != null) return `${Number(node.balance) / 1e8} LTC`;
  } catch (e) {
    console.warn(`⚠️ ltc blockchair failed: ${e?.message ?? e}`);
  }

  // Fallback: BlockCypher
  try {
    const res = await withTimeout(
      AXIOS.get(
        `https://api.blockcypher.com/v1/ltc/main/addrs/${address}/balance`
      ),
      TIMEOUT_MS,
      "ltc.blockcypher"
    );
    if (res.data?.final_balance != null)
      return `${res.data.final_balance / 1e8} LTC`;
  } catch (e) {
    console.warn(`⚠️ ltc blockcypher failed: ${e?.message ?? e}`);
  }

  return `Error: LTC all endpoints failed`;
}

/* ------------------------ BSC / POLYGON ------------------------ */
async function getEvmBalance(chain, address, symbol) {
  try {
    const res = await safeRpcCall(
      RPC[chain],
      async (url) => {
        const provider = new ethers.JsonRpcProvider(url);
        const bal = await provider.getBalance(address);
        return ethers.formatEther(bal);
      },
      `${chain}.getBalance`
    );
    return `${res} ${symbol}`;
  } catch (e) {
    return `Error: ${e?.message ?? e}`;
  }
}

/* ------------------------ SOLANA ------------------------ */
async function getSolanaBalance(address) {
  try {
    let lastErr;
    for (const url of RPC.solana) {
      try {
        log(`🔌 solana RPC → ${url}`);
        const conn = new Connection(url, "processed");
        const pubKey = new PublicKey(address);
        const bal = await withTimeout(
          conn.getBalance(pubKey),
          TIMEOUT_MS,
          "sol.getBalance"
        );
        return `${bal / 1e9} SOL`;
      } catch (e) {
        lastErr = e;
        console.warn(`⚠️ solana failed @ ${url}: ${e?.message ?? e}`);
      }
    }
    throw lastErr ?? new Error("solana all RPCs failed");
  } catch (e) {
    return `Error: ${e?.message ?? e}`;
  }
}

/* ------------------------ RIPPLE ------------------------ */
async function getXRPBalance(address) {
  try {
    const info = await wsFallback(
      RPC.xrpWs,
      async (server) => {
        const api = new RippleAPI({ server });
        await api.connect();
        try {
          return await api.getAccountInfo(address);
        } finally {
          try {
            await api.disconnect();
          } catch {}
        }
      },
      "xrp.ws"
    );
    return `${info.xrpBalance} XRP`;
  } catch (e) {
    return `Error: ${e?.message ?? e}`;
  }
}

/* ------------------------ CARDANO (Koios, no key) ------------------------ */
async function getADABalance(address) {
  // Soft validation with CardanoWasm (does not block if it throws)
  try {
    CardanoWasm?.Address?.from_bech32?.(address);
  } catch (e) {
    console.warn(
      `⚠️ CardanoWasm validation failed, will still query: ${e?.message ?? e}`
    );
  }

  // Try Koios (no API key)
  for (const base of RPC.cardanoKoios) {
    try {
      const res = await withTimeout(
        AXIOS.get(`${base}${address}`),
        TIMEOUT_MS,
        "ada.koios"
      );
      const arr = Array.isArray(res.data) ? res.data : [];
      const item = arr[0];
      const lovelace = Number(item?.balance ?? 0);
      return `${lovelace / 1e6} ADA`;
    } catch (e) {
      console.warn(`⚠️ Koios failed @ ${base}: ${e?.message ?? e}`);
    }
  }

  return `Error: ADA all endpoints failed`;
}

/* ------------------------ MASTER ------------------------ */
export async function getAllBalances(addresses) {
  // Run all in parallel so one slow chain can't block the rest
  const tasks = {
    eth: getEthBalance(addresses.eth),
    usdc: getERC20Balance(
      addresses.eth,
      "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      "USDC"
    ),
    usdt: getERC20Balance(
      addresses.eth,
      "0xdAC17F958D2ee523a2206206994597C13D831ec7",
      "USDT"
    ),
    // ✅ Correct USDT TRC20 contract on TRON:
    usdt_trc20: getTRC20Balance(
      addresses.trx,
      "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t",
      "USDT"
    ),
    btc: getBitcoinBalance(addresses.btc),
    ltc: getLitecoinBalance(addresses.ltc),
    bnb: getEvmBalance("bsc", addresses.bnb, "BNB"),
    matic: getEvmBalance("polygon", addresses.matic, "MATIC"),
    sol: getSolanaBalance(addresses.sol),
    xrp: getXRPBalance(addresses.xrp),
    ada: getADABalance(addresses.ada),
  };

  const settled = await Promise.allSettled(Object.values(tasks));
  const keys = Object.keys(tasks);
  const out = {};
  settled.forEach((r, i) => {
    out[keys[i]] =
      r.status === "fulfilled"
        ? r.value
        : `Error: ${r.reason?.message ?? r.reason}`;
  });
  return out;
}

/* ------------------------ DEMO ------------------------ */
(async () => {
  const addresses = {
    eth: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    trx: "TP8B9wv2RYZrmHUEPqbAsinu8N783YfxJE",
    btc: "34xp4vRoCGJym3xR7yCVPFHoCNxv4Twseo",
    ltc: "LNh7e1k4L2DdyK6B8y6jQf7UobzXehJ9wW",
    bnb: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    matic: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    sol: "vZAXoGEt9W6SxiCSszxupaVF38zefdc6VGdxTZM5YZS",
    xrp: "rDsbeomae4FXwgQTJp9Rs64Qg9vDiTCdBv",
    ada: "addr1qx2fx5z4f2cayc9r73yj7a8p9krz2dcl8sdm8z5fq3m9cnthg5nmn98k8ac9uwr8cczv47t4kmqnjy37w29qkxx9u0rqqc4l06",
  };

  console.log("🔍 Fetching balances...");
  try {
    const balances = await withTimeout(
      getAllBalances(addresses),
      TIMEOUT_MS * 2,
      "getAllBalances"
    );
    console.table(balances);
  } catch (e) {
    console.error("💥 Top-level error:", e?.message ?? e);
  }
})();
