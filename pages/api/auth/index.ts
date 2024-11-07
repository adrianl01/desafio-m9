import { NextApiRequest, NextApiResponse } from "next";
import { sendCode } from "../../../controllers/auth";
import { sendEmail } from "../../../lib/mailjet";
import methods from "micro-method-router"

export default methods({
    async post(req: NextApiRequest, res: NextApiResponse) {
        const auth = await sendCode(req.body.email)

        // email sender comentado pero funcionando😉
        // const sendEmailRes = await sendEmail(auth.data)
        res.send(auth.data)
    }
})





// CONCEPTOS MVC
// los endpoints sólo reciben y checkean las req y querys
// siempre la salida del endpoint tiene que ser predecible
// no tiene que hacer nada mas que recibir userId

// delegar el resto a un controller que es la siguiente capa
// los controllers son un montón de funciones o una clase con funciones
// la mayoría de los endpoints deberían delegar todo a los controllers

// la última capa son los models
// son o clases o funciones, mejor es una clase
// porque se representa como un registro de la db
// es más fácil de manipular la data
// se puede usar fireorm
// nos deja hacer abstracciones mucho mas facilmente
// sólo esta es la capa que se comunica con la db
// el controller no tiene que saber sobre el db
// el controller tiene que decir "dame un user", "dame un producto",
// "compará esto", "guardá este user", "modificá esto"
// si se respetan las capas, es mas fácil detectar errores
// lib no pertenece al sistema de capas


// si puedo escribir hasta donde llegan las responsabilidades
// de cada capa, y día a día ir agregando detalles sobre cada capa
// vamos a ir ejercitando y mejorando nuestras habilidades de arquitectura
