import Navbar from './Navbar'
import Footer from './Footer'

export default function Layout({ children }: any) {
  return (
    <>
      <Navbar />
        <main className='flex justify-center py-16'>
          {children}
        </main>
      <Footer />
    </>
  )
}