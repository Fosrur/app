using Microsoft.AspNetCore.Authorization;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Mvc;
using app.Models.Adapters;
using Newtonsoft.Json;
using app.Models.Dto;
using app.Extensions;
using app.Models;


namespace app.Controllers
{
    public class CityController : Controller
    {
		[Route("~/city")]
		//[Authorize]
		[HttpGet]
		public ActionResult Index()
		{
			string email = VerifyToken.CaricoUtenteRichiesta(this.HttpContext);
			if (string.IsNullOrEmpty(email)) { return new EmptyResult(); }

			return View();
		}

        [HttpGet]
        public async Task<ActionResult> GetCity()
        {
            string email = VerifyToken.CaricoUtenteRichiesta(HttpContext);
            if (string.IsNullOrEmpty(email)) { return new EmptyResult(); }

            AdapterCity adapterCity = new()
            {
                AccountMail = email,
                city = new()
                {
                    Id = 0,
                    Nome = "",
                    Provincia = "",
                    Regione = "",
                    Nazione = "",
                    Popolazione = 0,
                    Superficie = 0,
                    Altitudine = 0,
                    Longitudine = 0,
                    Latitudine = 0,
                    DataFondazione = DateTime.Now,
                    SitoWeb = "",
                    Note = "",
                    CreatedUser = 0,
                    CreatedDate = DateTime.Now,
                    Status = 1
                }
            };

            ApiResult<City> apiResult = JsonConvert.DeserializeObject<ApiResult<City>>(await adapterCity.GetCityAsync())!;

            return apiResult.Esito == "OK"
                ? Json(new { Esito = "OK", Data = apiResult.Item?.Table })
                : Json(new { Esito = apiResult.Esito, Error = apiResult.Item?.Error });
        }

        [HttpPost]
        public async Task<ActionResult> Create(string json)
        {
            string email = VerifyToken.CaricoUtenteRichiesta(HttpContext);
            if (string.IsNullOrEmpty(email)) { return new EmptyResult(); }

            try
            {
                var req = JsonConvert.DeserializeObject<City>(json);
                if (req?.Provincia?.Length > 2)
                {
                    return Json(new { Esito = "KO", Error = "La provincia deve contenere solo due caratteri" });
                }
                if (!Regex.IsMatch(req?.Provincia!, @"^[a-zA-Z]+$"))
                {
                    return Json(new { Esito = "KO", Error = "La provincia non deve contenere caratteri speciali o numeri" });
                }

                AdapterCity adapterCity = new()
                {
                    AccountMail = email,
                    listCity = new()
                    {
                        new()
                        {
                            Id = 0,
                            Nome = req?.Nome,
                            Provincia = req?.Provincia,
                            Regione = req?.Regione,
                            Nazione = req?.Nazione,
                            Popolazione = 0,
                            Superficie = 0,
                            Altitudine = 0,
                            Longitudine = 0,
                            Latitudine = 0,
                            DataFondazione = null,
                            SitoWeb = req?.SitoWeb,
                            Note = req?.Note,
                            CreatedUser = 1,
                            CreatedDate = DateTime.Now,
                            Status = req?.Status ?? 1
                        }
                    }
                };

                string response = await adapterCity.CreateCityAsync();
                ApiResult<City> apiResult = JsonConvert.DeserializeObject<ApiResult<City>>(response)!;

                return apiResult.Esito == "OK"
                    ? Json(new { Esito = "OK", Data = apiResult.Item?.Table })
                    : Json(new { Esito = apiResult.Esito, Error = apiResult.Item?.Error });
            }
            catch (Exception ex)
            {
                return Json(new { Esito = "KO", Error = ex.Message });
            }
        }

        [HttpPut]
        public async Task<ActionResult> Update(string json)
        {
            string email = VerifyToken.CaricoUtenteRichiesta(this.HttpContext);
            if (string.IsNullOrEmpty(email)) { return new EmptyResult(); }

            try
            {
                var req = JsonConvert.DeserializeObject<City>(json);
                if (req?.Provincia?.Length > 2)
                {
                    return Json(new { Esito = "KO", Error = "La provincia deve contenere solo due caratteri" });
                } 
                if (!Regex.IsMatch(req?.Provincia!, @"^[a-zA-Z]+$"))
                {
                    return Json(new { Esito = "KO", Error = "La provincia non deve contenere caratteri speciali o numeri" });
                }

                AdapterCity adapterCity = new()
                {
                    AccountMail = email,
                    city = new()
                    {
                        Id = req?.Id ?? 0,
                        Nome = req?.Nome,
                        Provincia = req?.Provincia,
                        Regione = req?.Regione,
                        Nazione = req?.Nazione,
                        Popolazione = 0,
                        Superficie = 0,
                        Altitudine = 0,
                        Longitudine = 0,
                        Latitudine = 0,
                        DataFondazione = null,
                        SitoWeb = req?.SitoWeb,
                        Note = req?.Note,
                        UpdatedUser = 1,
                        UpdatedDate = DateTime.Now,
                        Status = req?.Status ?? 1
                    }
                };

                string response = await adapterCity.UpdateCityAsync();
                ApiResult<City> apiResult = JsonConvert.DeserializeObject<ApiResult<City>>(response)!;

                return apiResult.Esito == "OK"
                ? Json(new { Esito = "OK", Data = apiResult.Item?.Table })
                : Json(new { Esito = apiResult.Esito, Error = apiResult.Item?.Error });
            }
            catch (Exception ex)
            {
                return Json(new { Esito = "KO", Error = ex.Message });
            }
        }
    }
}
