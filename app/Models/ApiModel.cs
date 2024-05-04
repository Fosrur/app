namespace app.Models
{
    public class ApiResult<T>
    {
        public string? Esito { get; set; }
        public ApiItem<T>? Item { get; set; }
    }

    public class ApiItem<T>
    {
        public string? Error { get; set; }
        public List<T>? Table { get; set; }
    }
}