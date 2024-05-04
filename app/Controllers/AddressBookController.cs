using Microsoft.AspNetCore.Authorization;
using System.Text.RegularExpressions;
using Newtonsoft.Json.Converters;
using Microsoft.AspNetCore.Mvc;
using app.Models.Adapters;
using Newtonsoft.Json;
using app.Models.Dto;
using app.Extensions;
using app.Models;


namespace app.Controllers
{
    public class AddressBookController : Controller
    {
		[Route("~/addressBook")]
		//[Authorize]
		[HttpGet]
		public ActionResult Index()
		{
			string email = VerifyToken.CaricoUtenteRichiesta(this.HttpContext);
			if (string.IsNullOrEmpty(email)) { return new EmptyResult(); }

			return View();
		}

        [HttpGet]
        public async Task<ActionResult> GetAddressBook()
        {
            string email = VerifyToken.CaricoUtenteRichiesta(HttpContext);
            if (string.IsNullOrEmpty(email)) { return new EmptyResult(); }

            AdapterAddressBook adapterAddressBook = new()
            {
                AccountMail = email,
                addressBook = new()
                {
                    Id = 0,
                    Nome = "",
                    Cognome = "",
                    IdSesso = 0,
                    Sesso = ' ',
                    DataNascita = DateTime.Now,
                    NumeroTelefono = "",
                    Email = "",
                    IdCitta = 0,
                    Citta = "",
                    CreatedUser = 0,
                    CreatedDate = DateTime.Now,
                    Status = 1
                }
            };

            ApiResult<AddressBook> apiResult = JsonConvert.DeserializeObject<ApiResult<AddressBook>>(await adapterAddressBook.GetAddressBookAsync())!;

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
                var format = "dd/MM/yyyy";
                var dateTimeConverter = new IsoDateTimeConverter { DateTimeFormat = format };

                var req = JsonConvert.DeserializeObject<AddressBook>(json, dateTimeConverter);
                if (req?.NumeroTelefono?.Length > 10)
                {
                    return Json(new { Esito = "KO", Error = "Il numero di telefono deve contenere solo 10 numeri" });
                }
                if (!Regex.IsMatch(req?.NumeroTelefono!, @"^[0-9]+$"))
                {
                    return Json(new { Esito = "KO", Error = "Il numero di telefono deve contenere solo numeri" });
                }
                if (!string.IsNullOrEmpty(req?.Email) && !Regex.IsMatch(req.Email, @"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"))
                {
                    return Json(new { Esito = "KO", Error = "L'email non è nel formato corretto" });
                }

                AdapterAddressBook adapterAddressBook = new()
                {
                    AccountMail = email,
                    listAddressBook = new()
                    {
                        new()
                        {
                            Id = 0,
                            Nome = req?.Nome,
                            Cognome = req?.Cognome,
                            IdSesso = req?.IdSesso ?? 0,
                            DataNascita = req?.DataNascita,
                            NumeroTelefono = req?.NumeroTelefono,
                            Email = req?.Email,
                            IdCitta = req?.IdCitta ?? 0,
                            CreatedUser = 1,
                            CreatedDate = DateTime.Now,
                            Status = req?.Status ?? 1
                        }
                    }
                };

                string response = await adapterAddressBook.CreateAddressBookAsync();
                ApiResult<AddressBook> apiResult = JsonConvert.DeserializeObject<ApiResult<AddressBook>>(response)!;

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
                var format = "dd/MM/yyyy";
                var dateTimeConverter = new IsoDateTimeConverter { DateTimeFormat = format };

                var req = JsonConvert.DeserializeObject<AddressBook>(json, dateTimeConverter);
                if (req?.NumeroTelefono?.Length > 10)
                {
                    return Json(new { Esito = "KO", Error = "Il numero di telefono deve contenere solo 10 numeri" });
                }
                if (!Regex.IsMatch(req?.NumeroTelefono!, @"^[0-9]+$"))
                {
                    return Json(new { Esito = "KO", Error = "Il numero di telefono deve contenere solo numeri" });
                }
                if (!string.IsNullOrEmpty(req?.Email) && !Regex.IsMatch(req.Email, @"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"))
                {
                    return Json(new { Esito = "KO", Error = "L'email non è nel formato corretto" });
                }

                AdapterAddressBook adapterAddressBook = new()
                {
                    AccountMail = email,
                    addressBook = new()
                    {
                        Id = req?.Id ?? 0,
                        Nome = req?.Nome,
                        Cognome = req?.Cognome,
                        IdSesso = req?.IdSesso ?? 0,
                        DataNascita = req?.DataNascita,
                        NumeroTelefono = req?.NumeroTelefono,
                        Email = req?.Email,
                        IdCitta = req?.IdCitta ?? 0,
                        UpdatedUser = 1,
                        UpdatedDate = DateTime.Now,
                        Status = req?.Status ?? 1
                    }
                };

                string response = await adapterAddressBook.UpdateAddressBookAsync();
                ApiResult<AddressBook> apiResult = JsonConvert.DeserializeObject<ApiResult<AddressBook>>(response)!;

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