import connectToDB from "@/configs/db";
import Footer from "../components/modules/footer/Footer";
import Navbar from "../components/modules/navbar/Navbar";
import Cart from "../components/template/cart/Cart";
import { authUser } from "@/utils/auth-server";

export default async function CartPage() {
connectToDB()
  const user = await authUser()

  return(
    <>
    <Navbar isLogin={!!user}/>
    <Cart/>
    <Footer/>
    </>
  )
}