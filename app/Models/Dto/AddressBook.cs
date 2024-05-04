namespace app.Models.Dto
{
    public class AddressBook
    {
        public int Id { get; set; }
        public string? Nome { get; set; }
        public string? Cognome { get; set; }
        public int IdSesso { get; set; }
        public char? Sesso { get; set; }
        public DateTime? DataNascita { get; set; }
        public string? NumeroTelefono { get; set; }
        public string? Email { get; set; }
        public int? IdCitta { get; set; }
        public string? Citta { get; set; }
        public int CreatedUser { get; set; }
        public DateTime? CreatedDate { get; set; }
        public int? UpdatedUser { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public int Status { get; set; }
    }
}
