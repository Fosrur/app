using System.Security.Claims;


namespace app.Extensions
{
    public class VerifyToken
    {
        public static string CaricoUtenteRichiesta(HttpContext context)
        {
            var userClaims = context.User.Identity as ClaimsIdentity;
            string email = userClaims?.FindFirst("preferred_username")?.Value ?? "andrzej.mari.15@hotmail.com";
            string tenantid = userClaims?.FindFirst("http://schemas.microsoft.com/identity/claims/tenantid")?.Value!;

            if (tenantid != "e0110fbb-514a-45f6-8c28-4b6b7c130d62")
                return email;
            else
                return email;
        }
    }
}
