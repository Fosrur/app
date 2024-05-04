using app.Extensions;


var builder = WebApplication.CreateBuilder(args);
builder.Services.AddPersistenceServiceExtensions(builder.Configuration);

var app = builder.Build();
app.AddCoreBuilderExtensions(app.Environment);
app.Run();