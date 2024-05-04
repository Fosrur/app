using System.Net.Http.Headers;
using app.Models.Adapters;
using Newtonsoft.Json;
using System.Text;
using System.Net;


namespace app.Extensions
{
    public class HttpClientHandler
    {
        private readonly HttpClient httpClient;
        private static IConfiguration? _configuration;

        public HttpClientHandler()
        {
            _configuration = new ConfigurationBuilder()
              .SetBasePath(Directory.GetCurrentDirectory())
              .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
              .Build();

            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls11 | SecurityProtocolType.Tls12;

            httpClient = new HttpClient();
            httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
        }

        private string BuildApiUrl(Adapter adapter)
        {
            (string appUrl, string coreUrl) = VerifyUrl.GetUrls(_configuration!);
            return $"{coreUrl}{adapter.getApiName()}?{adapter.GetParams()}";
        }

        public async Task<string> GetDatiAsync(Adapter adapter)
        {
            string url = BuildApiUrl(adapter);

            try
            {
                return await httpClient.GetStringAsync(url);
            }
            catch (HttpRequestException e)
            {
                return e.Message;
            }
        }

        public async Task<string> SetDatiAsync(Adapter adapter, object json)
        {
            string url = BuildApiUrl(adapter);
            string serializedJson = JsonConvert.SerializeObject(json);

            try
            {
                var content = new StringContent(serializedJson, Encoding.UTF8, "application/json");
                var response = await httpClient.PostAsync(url, content);
                return await response.Content.ReadAsStringAsync();
            }
            catch (HttpRequestException)
            {
                return string.Empty;
            }
        }
    }
}
