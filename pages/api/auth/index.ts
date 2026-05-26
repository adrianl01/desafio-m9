import { NextApiRequest, NextApiResponse } from "next";
import { createCode } from "../../../controllers/auth";
import { sendEmail } from "../../../lib/mailjet";
import { runMiddleware } from "../../../lib/corsMiddleware";

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  await runMiddleware(req, res);
  if (req.method === "POST") {
    const { email } = req.body;
    if (!email) {
      return res
        .status(400)
        .json({ message: "You need to provide an email address" });
    }
    const auth = await createCode(email);
    // email sender comentado pero funcionando😉
    await sendEmail(auth.data);
    res.status(200).send(auth.data);
  } else {
    res.status(405).send({ message: "Method Not Allowed" });
  }
}

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
