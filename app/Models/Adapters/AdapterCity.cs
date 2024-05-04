using app.Models.Dto;


namespace app.Models.Adapters
{
    public class AdapterCity : Adapter
    {
        public City city;
        public List<City> listCity;

        public AdapterCity()
        {
            city = new();
            listCity = new();
        }

        public override string GetParams() => base.GetParams() ?? "";

        private async Task<string> ExecuteApiAsync(string apiEndpoint, object? data = null)
        {
            comm = new Extensions.HttpClientHandler();
            SetApiName(apiEndpoint);

            return data == null
                ? await comm.GetDatiAsync(this)
                : await comm.SetDatiAsync(this, data);
        }

        public async Task<string> GetCityAsync() => await ExecuteApiAsync("/api/output/GetCity", city);

        public async Task<string> CreateCityAsync() => await ExecuteApiAsync("/api/input/SetCity", listCity);

        public async Task<string> UpdateCityAsync() => await ExecuteApiAsync("/api/update/SetCity", city);

        public async Task<string> DeleteCityAsync() => await ExecuteApiAsync("/api/delete/DeleteCity", listCity);
    }
}