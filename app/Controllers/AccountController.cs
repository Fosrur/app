using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;


namespace app.Controllers
{
    public class AccountController : Controller
    {
        [Route("~/account/login")]
        [AllowAnonymous]
        [HttpGet]
        public ActionResult Login()
        {
            return View();
        }

        [HttpGet]
        public IActionResult Logout()
        {
            return RedirectToAction("Login", "Account");
        }
    }
}