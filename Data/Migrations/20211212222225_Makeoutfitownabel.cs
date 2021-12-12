using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Data.Migrations
{
    public partial class Makeoutfitownabel : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Outfit_Person_PersonID",
                table: "Outfit");

            migrationBuilder.RenameColumn(
                name: "PersonID",
                table: "Outfit",
                newName: "OwnerID");

            migrationBuilder.RenameIndex(
                name: "IX_Outfit_PersonID",
                table: "Outfit",
                newName: "IX_Outfit_OwnerID");

            migrationBuilder.AddForeignKey(
                name: "FK_Outfit_Person_OwnerID",
                table: "Outfit",
                column: "OwnerID",
                principalTable: "Person",
                principalColumn: "ID");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Outfit_Person_OwnerID",
                table: "Outfit");

            migrationBuilder.RenameColumn(
                name: "OwnerID",
                table: "Outfit",
                newName: "PersonID");

            migrationBuilder.RenameIndex(
                name: "IX_Outfit_OwnerID",
                table: "Outfit",
                newName: "IX_Outfit_PersonID");

            migrationBuilder.AddForeignKey(
                name: "FK_Outfit_Person_PersonID",
                table: "Outfit",
                column: "PersonID",
                principalTable: "Person",
                principalColumn: "ID");
        }
    }
}
