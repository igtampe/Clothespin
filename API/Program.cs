using Microsoft.OpenApi.Models;
using Igtampe.Clothespin.Data;
using Igtampe.Clothespin.Common;
using Igtampe.Clothespin.Common.Clothes.Items;
using Igtampe.Clothespin.Common.Tracking;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options => {
    options.SwaggerDoc("BETA_STANDALONE", new OpenApiInfo {
        Version = "BETA_STANDALONE", Title = "Clothespin API",
        Description = "An API For Clothespin",
        //TermsOfService = new Uri("https://example.com/terms"),
        Contact = new OpenApiContact {
            Name = "Chopo",
            Url = new Uri("https://twitter.com/igtampe"),
            Email = "igtampe@gmail.com",
        },
        License = new OpenApiLicense {
            Name = "CC0",
            //Url = new Uri("https://example.com/license") //TODO: Actually specify the license once this is done
        }
    });
    options.IncludeXmlComments("./API.xml");
});

builder.Services.AddDbContext<ClothespinContext>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment()) {
    app.UseSwagger();
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/BETA_STANDALONE/swagger.json", "Clothespin API"));
    app.UseDeveloperExceptionPage();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();