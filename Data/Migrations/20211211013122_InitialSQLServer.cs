using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Data.Migrations
{
    public partial class InitialSQLServer : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "User",
                columns: table => new
                {
                    Username = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Password = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_User", x => x.Username);
                });

            migrationBuilder.CreateTable(
                name: "Person",
                columns: table => new
                {
                    ID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TiedUserUsername = table.Column<string>(type: "nvarchar(450)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Person", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Person_User_TiedUserUsername",
                        column: x => x.TiedUserUsername,
                        principalTable: "User",
                        principalColumn: "Username");
                });

            migrationBuilder.CreateTable(
                name: "Accessory",
                columns: table => new
                {
                    ID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Type = table.Column<int>(type: "int", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ImageURL = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Color = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    OwnerID = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    Deleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Accessory", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Accessory_Person_OwnerID",
                        column: x => x.OwnerID,
                        principalTable: "Person",
                        principalColumn: "ID");
                });

            migrationBuilder.CreateTable(
                name: "Belt",
                columns: table => new
                {
                    ID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Size = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Region = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Type = table.Column<int>(type: "int", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ImageURL = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Color = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    OwnerID = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    Deleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Belt", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Belt_Person_OwnerID",
                        column: x => x.OwnerID,
                        principalTable: "Person",
                        principalColumn: "ID");
                });

            migrationBuilder.CreateTable(
                name: "Overshirt",
                columns: table => new
                {
                    ID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Distinguisher = table.Column<int>(type: "int", nullable: false),
                    Size = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Region = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Type = table.Column<int>(type: "int", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ImageURL = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Color = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    OwnerID = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    Deleted = table.Column<bool>(type: "bit", nullable: false),
                    State = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Overshirt", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Overshirt_Person_OwnerID",
                        column: x => x.OwnerID,
                        principalTable: "Person",
                        principalColumn: "ID");
                });

            migrationBuilder.CreateTable(
                name: "Pants",
                columns: table => new
                {
                    ID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Distinguisher = table.Column<int>(type: "int", nullable: false),
                    Size = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Region = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Type = table.Column<int>(type: "int", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ImageURL = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Color = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    OwnerID = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    Deleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Pants", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Pants_Person_OwnerID",
                        column: x => x.OwnerID,
                        principalTable: "Person",
                        principalColumn: "ID");
                });

            migrationBuilder.CreateTable(
                name: "Shirt",
                columns: table => new
                {
                    ID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Distinguisher = table.Column<int>(type: "int", nullable: false),
                    Size = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Region = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Type = table.Column<int>(type: "int", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ImageURL = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Color = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    OwnerID = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    Deleted = table.Column<bool>(type: "bit", nullable: false),
                    State = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Shirt", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Shirt_Person_OwnerID",
                        column: x => x.OwnerID,
                        principalTable: "Person",
                        principalColumn: "ID");
                });

            migrationBuilder.CreateTable(
                name: "Shoes",
                columns: table => new
                {
                    ID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Distinguisher = table.Column<int>(type: "int", nullable: false),
                    Size = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Region = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Type = table.Column<int>(type: "int", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ImageURL = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Color = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    OwnerID = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    Deleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Shoes", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Shoes_Person_OwnerID",
                        column: x => x.OwnerID,
                        principalTable: "Person",
                        principalColumn: "ID");
                });

            migrationBuilder.CreateTable(
                name: "Socks",
                columns: table => new
                {
                    ID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Size = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Region = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Type = table.Column<int>(type: "int", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ImageURL = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Color = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    OwnerID = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    Deleted = table.Column<bool>(type: "bit", nullable: false),
                    State = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Socks", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Socks_Person_OwnerID",
                        column: x => x.OwnerID,
                        principalTable: "Person",
                        principalColumn: "ID");
                });

            migrationBuilder.CreateTable(
                name: "Outfit",
                columns: table => new
                {
                    ID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ShirtID = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    PantsID = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    BeltID = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    ShoesID = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    SocksID = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    PersonID = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Outfit", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Outfit_Belt_BeltID",
                        column: x => x.BeltID,
                        principalTable: "Belt",
                        principalColumn: "ID");
                    table.ForeignKey(
                        name: "FK_Outfit_Pants_PantsID",
                        column: x => x.PantsID,
                        principalTable: "Pants",
                        principalColumn: "ID");
                    table.ForeignKey(
                        name: "FK_Outfit_Person_PersonID",
                        column: x => x.PersonID,
                        principalTable: "Person",
                        principalColumn: "ID");
                    table.ForeignKey(
                        name: "FK_Outfit_Shirt_ShirtID",
                        column: x => x.ShirtID,
                        principalTable: "Shirt",
                        principalColumn: "ID");
                    table.ForeignKey(
                        name: "FK_Outfit_Shoes_ShoesID",
                        column: x => x.ShoesID,
                        principalTable: "Shoes",
                        principalColumn: "ID");
                    table.ForeignKey(
                        name: "FK_Outfit_Socks_SocksID",
                        column: x => x.SocksID,
                        principalTable: "Socks",
                        principalColumn: "ID");
                });

            migrationBuilder.CreateTable(
                name: "AccessoryOutfit (Dictionary<string, object>)",
                columns: table => new
                {
                    AccessoriesID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    OutfitsID = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AccessoryOutfit (Dictionary<string, object>)", x => new { x.AccessoriesID, x.OutfitsID });
                    table.ForeignKey(
                        name: "FK_AccessoryOutfit (Dictionary<string, object>)_Accessory_AccessoriesID",
                        column: x => x.AccessoriesID,
                        principalTable: "Accessory",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AccessoryOutfit (Dictionary<string, object>)_Outfit_OutfitsID",
                        column: x => x.OutfitsID,
                        principalTable: "Outfit",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "LogItem",
                columns: table => new
                {
                    ID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    OutfitID = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    Date = table.Column<DateTime>(type: "datetime2", nullable: true),
                    OwnerID = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    Note = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LogItem", x => x.ID);
                    table.ForeignKey(
                        name: "FK_LogItem_Outfit_OutfitID",
                        column: x => x.OutfitID,
                        principalTable: "Outfit",
                        principalColumn: "ID");
                    table.ForeignKey(
                        name: "FK_LogItem_Person_OwnerID",
                        column: x => x.OwnerID,
                        principalTable: "Person",
                        principalColumn: "ID");
                });

            migrationBuilder.CreateTable(
                name: "OutfitOvershirt (Dictionary<string, object>)",
                columns: table => new
                {
                    OutfitsID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    OvershirtsID = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OutfitOvershirt (Dictionary<string, object>)", x => new { x.OutfitsID, x.OvershirtsID });
                    table.ForeignKey(
                        name: "FK_OutfitOvershirt (Dictionary<string, object>)_Outfit_OutfitsID",
                        column: x => x.OutfitsID,
                        principalTable: "Outfit",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_OutfitOvershirt (Dictionary<string, object>)_Overshirt_OvershirtsID",
                        column: x => x.OvershirtsID,
                        principalTable: "Overshirt",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Accessory_OwnerID",
                table: "Accessory",
                column: "OwnerID");

            migrationBuilder.CreateIndex(
                name: "IX_AccessoryOutfit (Dictionary<string, object>)_OutfitsID",
                table: "AccessoryOutfit (Dictionary<string, object>)",
                column: "OutfitsID");

            migrationBuilder.CreateIndex(
                name: "IX_Belt_OwnerID",
                table: "Belt",
                column: "OwnerID");

            migrationBuilder.CreateIndex(
                name: "IX_LogItem_OutfitID",
                table: "LogItem",
                column: "OutfitID");

            migrationBuilder.CreateIndex(
                name: "IX_LogItem_OwnerID",
                table: "LogItem",
                column: "OwnerID");

            migrationBuilder.CreateIndex(
                name: "IX_Outfit_BeltID",
                table: "Outfit",
                column: "BeltID");

            migrationBuilder.CreateIndex(
                name: "IX_Outfit_PantsID",
                table: "Outfit",
                column: "PantsID");

            migrationBuilder.CreateIndex(
                name: "IX_Outfit_PersonID",
                table: "Outfit",
                column: "PersonID");

            migrationBuilder.CreateIndex(
                name: "IX_Outfit_ShirtID",
                table: "Outfit",
                column: "ShirtID");

            migrationBuilder.CreateIndex(
                name: "IX_Outfit_ShoesID",
                table: "Outfit",
                column: "ShoesID");

            migrationBuilder.CreateIndex(
                name: "IX_Outfit_SocksID",
                table: "Outfit",
                column: "SocksID");

            migrationBuilder.CreateIndex(
                name: "IX_OutfitOvershirt (Dictionary<string, object>)_OvershirtsID",
                table: "OutfitOvershirt (Dictionary<string, object>)",
                column: "OvershirtsID");

            migrationBuilder.CreateIndex(
                name: "IX_Overshirt_OwnerID",
                table: "Overshirt",
                column: "OwnerID");

            migrationBuilder.CreateIndex(
                name: "IX_Pants_OwnerID",
                table: "Pants",
                column: "OwnerID");

            migrationBuilder.CreateIndex(
                name: "IX_Person_TiedUserUsername",
                table: "Person",
                column: "TiedUserUsername");

            migrationBuilder.CreateIndex(
                name: "IX_Shirt_OwnerID",
                table: "Shirt",
                column: "OwnerID");

            migrationBuilder.CreateIndex(
                name: "IX_Shoes_OwnerID",
                table: "Shoes",
                column: "OwnerID");

            migrationBuilder.CreateIndex(
                name: "IX_Socks_OwnerID",
                table: "Socks",
                column: "OwnerID");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AccessoryOutfit (Dictionary<string, object>)");

            migrationBuilder.DropTable(
                name: "LogItem");

            migrationBuilder.DropTable(
                name: "OutfitOvershirt (Dictionary<string, object>)");

            migrationBuilder.DropTable(
                name: "Accessory");

            migrationBuilder.DropTable(
                name: "Outfit");

            migrationBuilder.DropTable(
                name: "Overshirt");

            migrationBuilder.DropTable(
                name: "Belt");

            migrationBuilder.DropTable(
                name: "Pants");

            migrationBuilder.DropTable(
                name: "Shirt");

            migrationBuilder.DropTable(
                name: "Shoes");

            migrationBuilder.DropTable(
                name: "Socks");

            migrationBuilder.DropTable(
                name: "Person");

            migrationBuilder.DropTable(
                name: "User");
        }
    }
}
