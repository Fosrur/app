namespace app.Extensions
{
    public static class Builder
    {
        public static IApplicationBuilder AddCoreBuilderExtensions(this IApplicationBuilder app, IHostEnvironment environment)
        {
            return app.UseOtherBuilder(environment);
        }

        public static IApplicationBuilder UseOtherBuilder(this IApplicationBuilder app, IHostEnvironment environment)
        {
            if (!environment.IsDevelopment())
            {
                app.UseExceptionHandler("/Home/Error");
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseRouting();
            app.UseAuthentication();
            app.UseAuthorization();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller=Home}/{action=Index}/{id?}");
            });

            return app;
        }
    }
}
