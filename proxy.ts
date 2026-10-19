import { NextResponse, type NextRequest } from "next/server";

// Revisión optimista: sin cookie de sesión, el panel redirige desde el servidor
// antes de enviar nada. La verificación real (sesión vigente en la base) la hace
// exigirAdmin() en cada página, acción y ruta del panel.
export function proxy(request: NextRequest) {
  if (!request.cookies.has("omichh_sesion")) {
    return NextResponse.redirect(new URL("/admin/entrar", request.url));
  }
  return NextResponse.next();
}

export const config = {
  // Todo el panel salvo la página para entrar y la exportación (que responde 401)
  matcher: ["/admin", "/admin/((?!entrar|exportar).*)"],
};
