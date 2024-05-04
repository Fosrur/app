using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Identity.Web.UI;
using Microsoft.Identity.Web;
using System.Security.Claims;


namespace app.Extensions
{
    public static class Service
    {
        public static IServiceCollection AddPersistenceServiceExtensions(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddAuthentication(options =>
            {
                options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                options.DefaultSignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
            })
            .AddCookie(x => x.LoginPath = "/account/login")
            .AddMicrosoftIdentityWebApp(configuration.GetSection("AzureAd"), OpenIdConnectDefaults.AuthenticationScheme, "ADCookies");

            services.Configure<OpenIdConnectOptions>(OpenIdConnectDefaults.AuthenticationScheme, options => {
                options.Authority = "https://login.microsoftonline.com/" + configuration["AzureAd:TenantId"] + "/v2.0/";
                options.ClientId = configuration["AzureAd:ClientId"];
                options.ResponseType = OpenIdConnectResponseType.CodeIdToken;
                options.CallbackPath = configuration["AzureAd:CallbackPath"];
                options.ClientSecret = configuration["AzureAd:ClientSecret"];
                options.RequireHttpsMetadata = false;
                options.SaveTokens = false;
                options.GetClaimsFromUserInfoEndpoint = true;
                options.SkipUnrecognizedRequests = true;
                options.SignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                options.ClaimActions.MapJsonKey(ClaimTypes.NameIdentifier, "sub");
                options.Events = new OpenIdConnectEvents
                {
                    OnRedirectToIdentityProvider = async ctxt =>
                    {
                        (string appUrl, string coreUrl) = VerifyUrl.GetUrls(configuration);
                        ctxt.ProtocolMessage.RedirectUri = appUrl;
                        await Task.Yield();
                    },
                    OnSignedOutCallbackRedirect = async ctxt =>
                    {
                        ctxt.Response.Redirect("/Account/Login");
                        ctxt.HandleResponse();
                        await Task.Yield();
                    }
                };
            });

            services.AddControllersWithViews().AddMicrosoftIdentityUI();
            services.AddControllers().AddNewtonsoftJson();

            return services;
        }
    }
}
