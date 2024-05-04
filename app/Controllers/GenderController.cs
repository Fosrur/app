using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using app.Models.Adapters;
using Newtonsoft.Json;
using app.Models.Dto;
using app.Extensions;
using app.Models;


namespace app.Controllers
{
    public class GenderController : Controller
    {
		[Route("~/gender")]
		//[Authorize]
		[HttpGet]
		public ActionResult Index()
		{
			string email = VerifyToken.CaricoUtenteRichiesta(this.HttpContext);
			if (string.IsNullOrEmpty(email)) { return new EmptyResult(); }

			return View();
		}

        [HttpGet]
        public async Task<ActionResult> GetGender()
        {
            string email = VerifyToken.CaricoUtenteRichiesta(HttpContext);
            if (string.IsNullOrEmpty(email)) { return new EmptyResult(); }

            AdapterGender adapterGender = new()
            {
                AccountMail = email,
                gender = new()
                {
                    Id = 0,
                    Descrizione = ' ',
                    CreatedUser = 0,
                    CreatedDate = DateTime.Now,
                    Status = 1
                }
            };

            ApiResult<Gender> apiResult = JsonConvert.DeserializeObject<ApiResult<Gender>>(await adapterGender.GetGenderAsync())!;

            return apiResult.Esito == "OK"
                ? Json(new { Esito = "OK", Data = apiResult.Item?.Table })
                : Json(new { Esito = apiResult.Esito, Error = apiResult.Item?.Error });
        }
    }
}
