import Header from "./Movies/Header"
import MovieContainerPage from "./Movies/MovieContainerPage"

function Home() {
  return (
    <>
    <Header/>

    <section className="mt-[10rem]">
      <MovieContainerPage/>
    </section>
    </>
  )
}

export default Home
