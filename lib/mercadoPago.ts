import { MercadoPagoConfig, MerchantOrder, Preference } from "mercadopago";
import type { MerchantOrderGetData } from "mercadopago/dist/clients/merchantOrder/get/types";
import type { PreferenceCreateData } from "mercadopago/dist/clients/preference/create/types";
const client = new MercadoPagoConfig({ accessToken: process.env.MP_TOKEN });
const resOrder = new MerchantOrder(client)
export async function getMerchOrder(id: MerchantOrderGetData) {
    const order = await resOrder.get(id);
    console.log(order);
    return order;
}
export async function generatePreference(data: PreferenceCreateData) {
    console.log(data)
    const newPref = new Preference(client)
    const body = data;
    try {
        const preference = await newPref.create(body)
        console.log("preference:", preference)
        return preference
    } catch (error) {
        console.log(error)
    }
}



