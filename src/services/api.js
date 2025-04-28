import { Categories } from "./categoriesService"
import { Products } from "./productsService"
import { Auth } from "./authService"
import { Order } from "./ordersService"
import { Clients } from "./clientsService"
import { ShoppingCart } from "./shoppingCartServices"
import { Address } from "./addressService"
import { Providers } from "./providersService"
import { Mail } from "./mailService"

export const api = {
    Products,
    Categories,
    Auth,
    Order,
    Clients,
    ShoppingCart,
    Address,
    Providers,
    Mail
}

// const apiUrl = 'https://api.bazarrshop.com'
const apiUrl = import.meta.env.DEV ? 'http://localhost:8000' : 'https://api.bazarrshop.com'

export const url = new URL(apiUrl + '/api')
export const urlStorage = new URL(apiUrl + '/storage')
export const urlProducts = new URL(url + '/products')
export const urlCategories = new URL(url + '/categories')
export const urlOrder = new URL(url + '/order')
export const urlClients = new URL(url + '/clients')
export const urlShoppingCart = new URL(url + '/cart')
export const urlAddress= new URL(url + '/user')
export const urlProvider= new URL(url + '/provider')
export const urlMail= new URL(url + '/mail')
export const urlAnalytics= new URL(url + '/analytics')