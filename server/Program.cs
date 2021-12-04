using Orleans.Hosting;
using System.Net;

await Host.CreateDefaultBuilder(args)
    .UseOrleans((ctx, siloBuilder) =>
    {
        // In order to support multiple hosts forming a cluster, they must listen on different ports.
        // Use the --InstanceId X option to launch subsequent hosts.
        var instanceId = ctx.Configuration.GetValue<int>("InstanceId");
        siloBuilder.UseLocalhostClustering(
            siloPort: 11111 + instanceId,
            gatewayPort: 30000 + instanceId,
            primarySiloEndpoint: new IPEndPoint(IPAddress.Loopback, 11111));
    })
    .ConfigureWebHostDefaults(webBuilder =>
    {
        webBuilder.UseStartup<Startup>();
        webBuilder.ConfigureKestrel((ctx, kestrelOptions) =>
        {
            // To avoid port conflicts, each Web server must listen on a different port.
            var instanceId = ctx.Configuration.GetValue<int>("InstanceId");
            kestrelOptions.ListenLocalhost(5000 + instanceId);
        });
    })
    .RunConsoleAsync();



public class Startup
{
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddControllers();
        services.AddCors(options =>
        {
            // YOLO
            options.AddPolicy(name: "LocalDev",
                builder =>
                {
                    builder.AllowAnyHeader();
                    builder.AllowAnyMethod();
                    builder.AllowAnyOrigin();
                });
        });
    }

    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
        if (env.IsDevelopment())
        {
            app.UseDeveloperExceptionPage();
        }

        // app.UseHttpsRedirection();
        app.UseStaticFiles();
        app.UseDefaultFiles();
        app.UseRouting();
        app.UseCors("LocalDev");

        app.UseAuthorization();

        app.UseEndpoints(endpoints =>
        {
            endpoints.MapDefaultControllerRoute();
        });
    }
}
