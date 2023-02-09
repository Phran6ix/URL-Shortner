import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

import Url from "App/Models/Url";

async function generateUrl() {
  let url = Math.random().toString(36).substring(2, 9);
  if (await Url.findBy("short_url", url)) {
    return generateUrl();
  } else {
    return url;
  }
}

export default class UrlsController {
  public async inputUrl({ request, response }: HttpContextContract) {
    const inputUrl = request.input("url");
    const random = await generateUrl();

    const url = new Url();
    url.long_url = inputUrl;
    url.short_url = random;
    await url.save();

    return `${request.completeUrl()}${random}`;
  }

  public async getUrl({ request, response }: HttpContextContract) {
    const code = request.param("short");

    const url = await Url.findBy("short_url", code);
    if (!url) {
      return response.notFound({ message: "Not Found" });
    }

    return response.send(url.long_url);
  }
}
