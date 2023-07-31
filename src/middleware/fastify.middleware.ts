import { FastifyRequest, FastifyReply } from "fastify"
import { Middleware, RequestContext } from "lucia"

export const fastify = (): Middleware<[FastifyRequest, FastifyReply]> => {
   return ({ args }) => {
      const [req, reply] = args;

      const getUrl = () => {
         if (!req.headers.host) return "";
         const protocol = req.protocol;
         const host = req.headers.host;
         const pathname = req.url;
         return `${protocol}://${host}${pathname}`;
      };

      const requestContext = {
         request: {
         url: getUrl(),
         method: req.method,
         headers: {
            origin: req.headers.origin ?? null,
            cookie: req.headers.cookie ?? null,
            authorization: req.headers.authorization ?? null
         }
         },
         setCookie: (cookie) => {
         reply.header('Set-Cookie', `${cookie.name}=${cookie.value}; ${cookie.attributes}`);
         }
      } as const satisfies RequestContext;

      return requestContext;
   };
};
