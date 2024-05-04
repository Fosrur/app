namespace app.Extensions
{
    public static class VerifyUrl
    {
        public static (string appUrl, string coreUrl) GetUrls(IConfiguration configuration)
        {
            bool isDebug = configuration.GetValue<bool>("Configuration:IsDebug");

            string appUrl = configuration.GetValue<string>($"Configuration:{(isDebug ? "AppConfig:DebugUrl" : "AppConfig:ProductionUrl")}")!;
            string coreUrl = configuration.GetValue<string>($"Configuration:{(isDebug ? "CoreConfig:DebugUrl" : "CoreConfig:ProductionUrl")}")!;

            return (appUrl, coreUrl);
        }
    }
}