namespace app.Models.Adapters
{
    public class Adapter
    {
        public Extensions.HttpClientHandler? comm;

        public string? AccountMail { get; set; }

        private string? ApiName { get; set; }

        public string? getApiName() => ApiName;

        public void SetApiName(string pApiName) => ApiName = pApiName;

        public virtual string? GetParams() => $"utente={AccountMail}";

        public async Task<string> GetDati()
        {
            comm ??= new Extensions.HttpClientHandler();
            return await comm.GetDatiAsync(this);
        }
    }
}