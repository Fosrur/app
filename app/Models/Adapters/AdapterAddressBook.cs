using app.Models.Dto;


namespace app.Models.Adapters
{
    public class AdapterAddressBook : Adapter
    {
        public AddressBook addressBook;
        public List<AddressBook> listAddressBook;

        public AdapterAddressBook()
        {
            addressBook = new();
            listAddressBook = new();
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

        public async Task<string> GetAddressBookAsync() => await ExecuteApiAsync("/api/output/GetAddressBook", addressBook);

        public async Task<string> CreateAddressBookAsync() => await ExecuteApiAsync("/api/input/SetAddressBook", listAddressBook);

        public async Task<string> UpdateAddressBookAsync() => await ExecuteApiAsync("/api/update/SetAddressBook", addressBook);

        public async Task<string> DeleteAddressBookAsync() => await ExecuteApiAsync("/api/delete/DeleteAddressBook", listAddressBook);
    }
}