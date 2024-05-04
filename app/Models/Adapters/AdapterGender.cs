using app.Models.Dto;


namespace app.Models.Adapters
{
    public class AdapterGender : Adapter
    {
        public Gender gender;

        public AdapterGender()
        {
            gender = new();
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

        public async Task<string> GetGenderAsync() => await ExecuteApiAsync("/api/output/GetGender", gender);
    }
}