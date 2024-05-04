using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using app.Models.Adapters;
using Newtonsoft.Json;
using app.Models.Dto;
using app.Extensions;


namespace app.Controllers
{
    public class HomeController : Controller
    {
		//[Authorize]
		[HttpGet]
		public ActionResult Index()
		{
			string email = VerifyToken.CaricoUtenteRichiesta(this.HttpContext);
			if (string.IsNullOrEmpty(email)) { return new EmptyResult(); }

            return View();
        }
	}
}