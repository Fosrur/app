namespace app.Models.Dto
{
    public class City
    {
        public int Id { get; set; }
        public string? Nome { get; set; }
        public string? Provincia { get; set; }
        public string? Regione { get; set; }
        public string? Nazione { get; set; }
        public int? Popolazione { get; set; }
        public decimal? Superficie { get; set; }
        public int? Altitudine { get; set; }
        public decimal Longitudine { get; set; } 
        public decimal Latitudine { get; set; }
        public DateTime? DataFondazione { get; set; }
        public string? SitoWeb { get; set; }
        public string? Note { get; set; }
        public int? CreatedUser { get; set; }
        public DateTime? CreatedDate { get; set; }
        public int? UpdatedUser { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public int Status { get; set; }
    }
}
