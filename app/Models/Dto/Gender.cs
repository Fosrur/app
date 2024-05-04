namespace app.Models.Dto
{
    public class Gender
    {
        public int Id { get; set; }
        public char? Descrizione { get; set; }
        public int CreatedUser { get; set; }
        public DateTime CreatedDate { get; set; }
        public int? UpdatedUser { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public int Status { get; set; }
    }
}
