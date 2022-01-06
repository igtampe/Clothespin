using Microsoft.AspNetCore.Mvc;
using Igtampe.Clothespin.Common;
using Igtampe.Clothespin.Common.Clothes.Items;
using Igtampe.Clothespin.Common.Clothes.Types;
using Igtampe.Clothespin.Common.Clothes;
using Igtampe.Clothespin.Common.Tracking;
using Igtampe.Clothespin.Data;
using Igtampe.ChopoSessionManager;
using Igtampe.Clothespin.API.Requests;
using Microsoft.EntityFrameworkCore;

namespace Igtampe.Clothespin.API.Controllers {

    /// <summary>Sort orders for Wearables</summary>
    public enum WearableSortType { 
    
        /// <summary>Sort by Name ascending</summary>
        BY_NAME = 0,

        /// <summary>Sort by name descending</summary>
        BY_NAME_DESC = 1,

        /// <summary>Sort by Type ascending</summary>
        BY_TYPE = 2,

        /// <summary>Sort by type descending</summary>
        BY_TYPE_DESC = 3,
    }

    /// <summary>Person controller which handles creation, updating persons</summary>
    [Route("API/Persons")]
    [ApiController]
    public class PersonController : ControllerBase {

        #region Private Vars

        private readonly ClothespinContext DB;

        #endregion

        #region Constructor

        /// <summary>Creates a Person Controller</summary>
        /// <param name="Context"></param>
        public PersonController(ClothespinContext Context) => DB = Context;

        #endregion

        #region PersonManagement

        //Get all User's Persons
        /// <summary>Gets all persons under a given session</summary>
        /// <param name="SessionID"></param>
        /// <returns></returns>
        [HttpGet]
        public async Task<IActionResult> PersonIndex([FromHeader] Guid SessionID) {

            //Check the session:
            Session? S = await Task.Run(() => SessionManager.Manager.FindSession(SessionID));
            if (S is null) { return BadRequest("Invalid session"); }

            //Get the User:
            User U = await DB.User.Include(U => U.Persons).FirstAsync(U => U.Username == S.UserID);
            //We do not check for null because if there's a session there's a user

            //Return Persons
            return Ok(U.Persons);

        }

        /// <summary>Gets a specific person</summary>
        /// <param name="SessionID"></param>
        /// <param name="PersonID"></param>
        /// <returns></returns>
        [HttpGet("{PersonID}")]
        public async Task<IActionResult> GetPerson([FromHeader] Guid SessionID, Guid PersonID) {
            //Check the session:
            Session? S = await Task.Run(() => SessionManager.Manager.FindSession(SessionID));
            if (S is null) { return BadRequest("Invalid session"); }

            //Get the Person:
            Person? P = await DB.Person.Where(P => P.ID == PersonID && P.TiedUser!=null && P.TiedUser.Username == S.UserID).FirstOrDefaultAsync();  

            //Return Person
            return P is not null ? Ok(P) : NotFound("Person was not found or is not tied to session owner");

        }

        //Create a person
        /// <summary>Creates a person under the given session's user</summary>
        /// <param name="SessionID">ID of the session executing this request</param>
        /// <param name="Person"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<IActionResult> CreatePerson([FromHeader] Guid SessionID, [FromBody] Person Person) {

            //Check the session:
            Session? S = await Task.Run(() => SessionManager.Manager.FindSession(SessionID));
            if (S is null) { return BadRequest("Invalid session"); }

            //Get the User:
            User U = await DB.User.Include(U => U.Persons).FirstAsync(U => U.Username == S.UserID);
            //We do not check for null because if there's a session there's a user

            //Create the person
            Person.ID = Guid.Empty;
            Person.TiedUser = U;

            //Add the Person
            U.Persons.Add(Person);

            //Save
            DB.User.Update(U);
            await DB.SaveChangesAsync();

            //Adios
            return Created("",Person);

        }

        //Update Person
        /// <summary>Updates a person under the given session's user</summary>
        ///<param name="SessionID">ID of the session executing this request</param>
        ///<param name="Item">Person with updated details</param>
        /// <returns></returns>
        [HttpPut]
        public async Task<IActionResult> UpdatePerson([FromHeader] Guid SessionID, [FromBody] Person Item) {

            //Check the session:
            Session? S = await Task.Run(() => SessionManager.Manager.FindSession(SessionID));
            if (S is null) { return BadRequest("Invalid session"); }

            //Get the person
            Person? P = await DB.Person.FirstOrDefaultAsync(P => P.ID==Item.ID && P.TiedUser != null && P.TiedUser.Username == S.UserID);
            if(P is null) { return NotFound("Person was not found, or person is not tied to session user"); }

            //Add the Person
            P.Name = string.IsNullOrWhiteSpace(Item.Name) ? P.Name : Item.Name;
            P.ImageURL = string.IsNullOrWhiteSpace(Item.ImageURL) ? P.ImageURL : Item.ImageURL;

            //Save
            DB.Person.Update(P);
            await DB.SaveChangesAsync();

            //Adios
            return Ok(P);

        }

        #endregion

        #region Person Clothes Getting

        //Get every type of wearable for a person

        /// <summary>Gets all of this person's accessories</summary>
        /// <param name="PersonID">ID of the person whose items we're looking for</param>
        /// <param name="Skip">Amount of items to skip</param>
        /// <param name="Take">Amount of items to take</param>
        /// <param name="Sort">Sort order</param>
        /// <param name="Query">Query to search for in name or in type</param>
        /// <param name="Type">Type of wearable to filter by</param>
        /// <param name="SessionID">ID of the session executing this request</param>
        /// <returns></returns>
        [HttpGet("Clothes/Accessories")]
        public async Task<IActionResult> GetAccessories([FromHeader] Guid SessionID, [FromQuery] Guid? PersonID, [FromQuery] int? Skip, [FromQuery] int? Take,
            [FromQuery] WearableSortType? Sort, [FromQuery] string? Query, [FromQuery] AccessoryType? Type) 
            => await GetWearables<Accessory, AccessoryType>(DB.Accessory, SessionID, PersonID, Skip ?? 0, Take ?? 20, Sort ?? WearableSortType.BY_NAME, Query ?? "", Type ?? AccessoryType.Other, Type is null);

        /// <summary>Gets all of this person's belts</summary>
        /// <param name="PersonID">ID of the person whose items we're looking for</param>
        /// <param name="Skip">Amount of items to skip</param>
        /// <param name="Take">Amount of items to take</param>
        /// <param name="Sort">Sort order</param>
        /// <param name="Query">Query to search for in name or in type</param>
        /// <param name="Type">Type of wearable to filter by</param>
        /// <param name="SessionID">ID of the session executing this request</param>
        /// <returns></returns>
        [HttpGet("Clothes/Belts")]
        public async Task<IActionResult> GetBelts([FromHeader] Guid SessionID, [FromQuery] Guid? PersonID, [FromQuery] int? Skip, [FromQuery] int? Take,
            [FromQuery] WearableSortType? Sort, [FromQuery] string? Query, [FromQuery] BeltType? Type)
            => await GetWearables<Belt, BeltType>(DB.Belt, SessionID, PersonID, Skip ?? 0, Take ?? 20, Sort ?? WearableSortType.BY_NAME, Query ?? "", Type ?? BeltType.Other, Type is null);

        /// <summary>Gets all of this person's Overshirts</summary>
        /// <param name="PersonID">ID of the person whose items we're looking for</param>
        /// <param name="Skip">Amount of items to skip</param>
        /// <param name="Take">Amount of items to take</param>
        /// <param name="Sort">Sort order</param>
        /// <param name="Query">Query to search for in name or in type</param>
        /// <param name="State">WashState to filter by</param>
        /// <param name="Type">Type of wearable to filter by</param>
        /// <param name="SessionID">ID of the session executing this request</param>
        /// <returns></returns>
        [HttpGet("Clothes/Overshirts")]
        public async Task<IActionResult> GetOvershirts([FromHeader] Guid SessionID, [FromQuery] Guid? PersonID, [FromQuery] int? Skip, [FromQuery] int? Take,
            [FromQuery] WearableSortType? Sort, [FromQuery] string? Query, [FromQuery] OvershirtType? Type, [FromQuery] WashState? State)
            => await GetWashables<Overshirt, OvershirtType>(DB.Overshirt, SessionID, PersonID, Skip ?? 0, Take ?? 20, Sort ?? WearableSortType.BY_NAME, Query ?? "", Type ?? OvershirtType.Other, Type is null, State);

        /// <summary>Gets all of this person's Pants</summary>
        /// <param name="PersonID">ID of the person whose items we're looking for</param>
        /// <param name="Skip">Amount of items to skip</param>
        /// <param name="Take">Amount of items to take</param>
        /// <param name="Sort">Sort order</param>
        /// <param name="Query">Query to search for in name or in type</param>
        /// <param name="State">WashState to filter by</param>
        /// <param name="Type">Type of wearable to filter by</param>
        /// <param name="SessionID">ID of the session executing this request</param>
        /// <returns></returns>
        [HttpGet("Clothes/Pants")]
        public async Task<IActionResult> GetPants([FromHeader] Guid SessionID, [FromQuery] Guid? PersonID, [FromQuery] int? Skip, [FromQuery] int? Take,
            [FromQuery] WearableSortType? Sort, [FromQuery] string? Query, [FromQuery] PantsType? Type, [FromQuery] WashState? State = null)
            => await GetWashables<Pants, PantsType>(DB.Pants, SessionID, PersonID, Skip ?? 0, Take ?? 20, Sort ?? WearableSortType.BY_NAME, Query ?? "", Type ?? PantsType.Other, Type is null, State);

        /// <summary>Gets all of this person's Shirts</summary>
        /// <param name="PersonID">ID of the person whose items we're looking for</param>
        /// <param name="Skip">Amount of items to skip</param>
        /// <param name="Take">Amount of items to take</param>
        /// <param name="Sort">Sort order</param>
        /// <param name="Query">Query to search for in name or in type</param>
        /// <param name="Type">Type of wearable to filter by</param>
        /// <param name="State">WashState to filter by</param>
        /// <param name="SessionID">ID of the session executing this request</param>
        /// <returns></returns>
        [HttpGet("Clothes/Shirts")]
        public async Task<IActionResult> GetShirts([FromHeader] Guid SessionID, [FromQuery] Guid? PersonID, [FromQuery] int? Skip, [FromQuery] int? Take,
            [FromQuery] WearableSortType? Sort, [FromQuery] string? Query, [FromQuery] ShirtType? Type, [FromQuery] WashState? State)
            => await GetWashables<Shirt, ShirtType>(DB.Shirt, SessionID, PersonID, Skip ?? 0, Take ?? 20, Sort ?? WearableSortType.BY_NAME, Query ?? "", Type ?? ShirtType.Other, Type is null, State);

        /// <summary>Gets all of this person's Shoes</summary>
        /// <param name="PersonID">ID of the person whose items we're looking for</param>
        /// <param name="Skip">Amount of items to skip</param>
        /// <param name="Take">Amount of items to take</param>
        /// <param name="Sort">Sort order</param>
        /// <param name="Query">Query to search for in name or in type</param>
        /// <param name="Type">Type of wearable to filter by</param>
        /// <param name="SessionID">ID of the session executing this request</param>
        /// <returns></returns>
        [HttpGet("Clothes/Shoes")]
        public async Task<IActionResult> GetShoes([FromHeader] Guid SessionID, [FromQuery] Guid? PersonID, [FromQuery] int? Skip, [FromQuery] int? Take,
            [FromQuery] WearableSortType? Sort, [FromQuery] ShoeType? Type, [FromQuery] string? Query)
            => await GetWearables<Shoes, ShoeType>(DB.Shoes, SessionID, PersonID, Skip ?? 0, Take ?? 20, Sort ?? WearableSortType.BY_NAME, Query ?? "", Type ?? ShoeType.Other, Type is null);

        /// <summary>Gets all of this person's Socks</summary>
        /// <param name="PersonID">ID of the person whose items we're looking for</param>
        /// <param name="Skip">Amount of items to skip</param>
        /// <param name="Take">Amount of items to take</param>
        /// <param name="Sort">Sort order</param>
        /// <param name="Query">Query to search for in name or in type</param>
        /// <param name="State">WashState to filter by</param>
        /// <param name="Type">Type of wearable to filter by</param>
        /// <param name="SessionID">ID of the session executing this request</param>
        /// <returns></returns>
        [HttpGet("Clothes/Socks")]
        public async Task<IActionResult> GetSocks([FromHeader] Guid SessionID, [FromQuery] Guid? PersonID, [FromQuery] int? Skip, [FromQuery] int? Take,
            [FromQuery] WearableSortType? Sort, [FromQuery] string? Query, [FromQuery] SockType? Type,[FromQuery] WashState? State = null)
            => await GetWashables<Socks, SockType>(DB.Socks, SessionID, PersonID, Skip ?? 0, Take ?? 20, Sort ?? WearableSortType.BY_NAME, Query ?? "", Type ?? SockType.Other, Type is null, State);

        /// <summary>Generic function to get a filtered list of a type of Wearable</summary>
        /// <typeparam name="E">Type of Wearable you wish to retrieve</typeparam>
        /// <typeparam name="F">Wearable's Type Enum</typeparam>
        /// <param name="WearableDBSet">Set of the wearable you wish to filter and retrieve</param>
        /// <param name="PersonID">ID of the person these wearables belong to</param>
        /// <param name="Skip">Amount of wearables to skip</param>
        /// <param name="Take">Amount of wearables to take</param>
        /// <param name="Sort">Sort order</param>
        /// <param name="Query">Query to search in the name or description</param>
        /// <param name="Type">Type of the type of wearable to filter by (IE Accessory --> Watch)</param>
        /// <param name="SessionID">ID of the session executing the request</param>
        /// <param name="IgnoreType"> Specifies whether or not to ignore the type parameter. This is a workaround, because I cannot do nullable enums over generic functions.</param>
        /// <returns></returns>
        [NonAction]
        private async Task<IActionResult> GetWearables<E, F>(IQueryable<E> WearableDBSet, Guid SessionID, Guid? PersonID, int Skip, int Take,
            WearableSortType Sort, string Query, F Type, bool IgnoreType = false) where F : Enum where E : Wearable<F> {

            if (PersonID is null) { return BadRequest("Person ID not specified"); }
            Query = Query.ToLower(); // For case insensitivity

            //Get the session
            Session? S = SessionManager.Manager.FindSession(SessionID);
            if (S is null) { return Unauthorized("Invalid session"); }

            //Get the person's Wearables
            IQueryable<E> BaseSet = WearableDBSet.Where(
                A => A.Owner != null && A.Owner.ID == PersonID && A.Owner.TiedUser != null && A.Owner.TiedUser.Username==S.UserID &&
                !A.Deleted && (A.Name.ToLower().Contains(Query) || A.Description.ToLower().Contains(Query)));

            if (!IgnoreType) {  BaseSet = BaseSet.Where(A=>A.Type.Equals(Type)); }

            //Order by
            switch (Sort) {
                case WearableSortType.BY_NAME:
                    BaseSet = BaseSet.OrderBy(A => A.Name);
                    break;
                case WearableSortType.BY_NAME_DESC:
                    BaseSet = BaseSet.OrderByDescending(A => A.Name);
                    break;
                case WearableSortType.BY_TYPE:
                    BaseSet = BaseSet.OrderBy(A => A.Type);
                    break;
                case WearableSortType.BY_TYPE_DESC:
                    BaseSet = BaseSet.OrderByDescending(A => A.Type);
                    break;
                default:
                    break;
            }

            //Take what we need
            BaseSet = BaseSet.Skip(Skip).Take(Take);

            //Make it a list and lets get out of here
            return Ok(await BaseSet.ToListAsync());

        }

        /// <summary>Generic function to get a filtered list of a type of Washable</summary>
        /// <typeparam name="E">Type of Washable you wish to retrieve</typeparam>
        /// <typeparam name="F">Washable's Type Enum</typeparam>
        /// <param name="WashableDBSet">Set of the wearable you wish to filter and retrieve</param>
        /// <param name="PersonID">ID of the person these washable belong to</param>
        /// <param name="Skip">Amount of wearables to skip</param>
        /// <param name="Take">Amount of wearables to take</param>
        /// <param name="Sort">Sort order</param>
        /// <param name="Query">Query to search in the name or description</param>
        /// <param name="State">State of the washables you wish to retrieve</param>
        /// <param name="Type">Type of wearable to filter by</param>
        /// <param name="SessionID">ID of the session executing the request</param>
        /// /// <param name="IgnoreType"> Specifies whether or not to ignore the type parameter. This is a workaround, because I cannot do nullable enums over generic functions.</param>
        /// <returns></returns>
        [NonAction]
        private async Task<IActionResult> GetWashables<E, F>(IQueryable<E> WashableDBSet, Guid SessionID, Guid? PersonID, int Skip, int Take,
            WearableSortType Sort, string Query, F Type, bool IgnoreType = false, WashState? State = null) where F : Enum where E : Washable<F> {

            //Let's hope this works
            return State is null ? await GetWearables<E, F>(WashableDBSet, SessionID, PersonID, Skip, Take, Sort, Query, Type, IgnoreType) 
                : await GetWearables<E, F>(WashableDBSet.Where(W => W.State == State), SessionID, PersonID, Skip, Take, Sort, Query, Type, IgnoreType); 
        }

        #endregion

        #region Outfit Management
        //Maybe this should go on a separate Controller?

        //Get person Outfits
        /// <summary>Gets all a person's Outfits</summary>
        /// <param name="PersonID">ID of the person whose outfits you wish to retrieve</param>
        /// <param name="Skip">Amount of outfits to skip</param>
        /// <param name="Take">Amount of outfits to take</param>
        /// <param name="Sort">Sort order for outfits</param>
        /// <param name="Query">Query to search in name or in description</param>
        /// <param name="SessionID">ID of the session executing this request</param>
        /// <returns></returns>
        [HttpGet("Outfits")]
        public async Task<IActionResult> GetOutfits([FromHeader] Guid SessionID, [FromQuery] Guid? PersonID, [FromQuery] int? Skip, 
            [FromQuery] int? Take, [FromQuery] WearableSortType? Sort, [FromQuery] string? Query) {

            if (PersonID is null) { return BadRequest("Person ID not specified"); }
            Query = (Query ?? "").ToLower();

            //Get the session
            Session? S = SessionManager.Manager.FindSession(SessionID);
            if (S is null) { return Unauthorized("Invalid session"); }

            IQueryable<Outfit> BaseSet = DB.Outfit
                .Include(O => O.Shirt)
                .Include(O => O.Overshirts)
                .Include(O => O.Pants)
                .Include(O => O.Shoes)
                .Include(O => O.Socks)
                .Include(O => O.Belt)
                .Include(O => O.Accessories)
                .Where(O => O.Owner != null && O.Owner.ID == PersonID && O.Owner.TiedUser != null && O.Owner.TiedUser.Username == S.UserID && !O.Deleted &&
                ( O.Name.ToLower().Contains(Query) || O.Description.ToLower().Contains(Query)));

            //Order by
            switch (Sort) {
                default:
                case WearableSortType.BY_NAME:
                    BaseSet = BaseSet.OrderBy(A => A.Name);
                    break;
                case WearableSortType.BY_NAME_DESC:
                    BaseSet = BaseSet.OrderByDescending(A => A.Name);
                    break;
                case WearableSortType.BY_TYPE:
                case WearableSortType.BY_TYPE_DESC: //Not acceptable
                    break;
            }

            BaseSet = BaseSet.Skip(Skip ?? 0).Take(Take ?? 20);

            return Ok(await BaseSet.ToListAsync());

        }

        //Search person outfit by list of wearables
        /// <summary>Search outfits by contained wearables</summary>
        /// <param name="Request"></param>
        /// <param name="Skip">How many outfits to skip</param>
        /// <param name="Take">How many outfits to take</param>
        /// <param name="SessionID">ID of the session executing this request</param>
        /// <returns></returns>
        [HttpPost("Outfits")]
        public async Task<IActionResult> OutfitWearableSearch([FromHeader] Guid SessionID, [FromBody]OutfitRequest Request, [FromQuery] int? Skip, [FromQuery] int? Take) {

            //Get the session
            Session? S = SessionManager.Manager.FindSession(SessionID);
            if (S is null) { return Unauthorized("Invalid session"); }

            IQueryable<Outfit> BaseSet = DB.Outfit.Include(O => O.Shirt)
                .Include(O => O.Overshirts)
                .Include(O => O.Pants)
                .Include(O => O.Shoes)
                .Include(O => O.Socks)
                .Include(O => O.Belt)
                .Include(O => O.Accessories)
                .Where(O=>O.Owner!= null && O.Owner.TiedUser!= null && O.Owner.TiedUser.Username==S.UserID);
                
            if (Request.ShirtID is not null) { BaseSet = BaseSet.Where(O => O.Shirt != null && O.Shirt.ID == Request.ShirtID); }
            if (Request.PantID is not null) { BaseSet = BaseSet.Where(O => O.Pants != null && O.Pants.ID == Request.PantID); }
            if (Request.ShoesID is not null) { BaseSet = BaseSet.Where(O => O.Shoes != null && O.Shoes.ID == Request.ShoesID); }
            if (Request.SocksID is not null) { BaseSet = BaseSet.Where(O => O.Socks != null && O.Socks.ID == Request.SocksID); }
            if (Request.BeltID is not null) { BaseSet = BaseSet.Where(O => O.Belt != null && O.Belt.ID == Request.ShirtID); }
            if (Request.OvershirtIDs is not null) {

                //I'm like 95% sure this won't map out
                //BaseSet = BaseSet.Where(O => Request.OvershirtIDs.All(ID => O.Overshirts.Contains(new() { ID = ID }))); 

                //This should map out a bit better
                Request.OvershirtIDs.ToList().ForEach(ID => BaseSet = BaseSet.Where(O => O.Overshirts.Any(OS => OS.ID == ID)));
            }

            if(Request.AccessoryIDs is not null) { Request.AccessoryIDs.ToList().ForEach(ID => BaseSet = BaseSet.Where(O => O.Accessories.Any(OS => OS.ID == ID))); }

            //OK we now have a queryable with a *bunch* of where conditions that should contain only the outfits we want.
            BaseSet = BaseSet.Skip(Skip ?? 0).Take(Take ?? 20);

            //Finally
            return Ok(await BaseSet.ToListAsync());
        
        }

        //Add Person Outfit
        /// <summary>Add an outfit</summary>
        /// <param name="Request"></param>
        /// <param name="SessionID">ID of the session executing this request</param>
        /// <returns></returns>
        [HttpPost("Outfits/Create")]
        public async Task<IActionResult> AddOutfit([FromHeader] Guid SessionID, [FromBody] OutfitCreateRequest Request) {

            //Ensure person is not null
            if (Request.PersonID is null) { return BadRequest("Person must not be null"); }

            //Check the session:
            Session? S = await Task.Run(() => SessionManager.Manager.FindSession(SessionID));
            if (S is null) { return Unauthorized("Invalid session"); }

            //Get the person
            Person? P = await DB.Person.FirstOrDefaultAsync(P=>P.ID==Request.PersonID && P.TiedUser != null && P.TiedUser.Username==S.UserID);
            if (P is null) { return NotFound("Person was not found, or is not tied to session owner"); }

            //Get the subitems
            List<Accessory> Accessories = new();
            if (Request.AccessoryIDs is not null) {
                foreach (Guid ID in Request.AccessoryIDs) {
                    Accessory? A = await DB.Accessory.FirstOrDefaultAsync(A => A.ID == ID);
                    if (A is null) { return NotFound($"Could not find Accessory with ID {ID}"); }
                    Accessories.Add(A);
                }
            }

            List<Overshirt> Overshirts = new();
            if (Request.OvershirtIDs is not null) {
                foreach (Guid ID in Request.OvershirtIDs) {
                    Overshirt? A = await DB.Overshirt.FirstOrDefaultAsync(A => A.ID == ID);
                    if (A is null) { return NotFound($"Could not find Overshirt with ID {ID}"); }
                    Overshirts.Add(A);
                }
            }

            Shirt? Shirt = null;
            Pants? Pants = null;
            Belt? Belt = null;
            Shoes? Shoes = null;
            Socks? Socks = null;

            if (Request.ShirtID is not null) {
                Shirt = await DB.Shirt.FirstOrDefaultAsync(S => S.ID == Request.ShirtID);
                if (Shirt is null) { return NotFound($"Could not find shirt with ID {Request.ShirtID}"); }
            }

            if (Request.PantID is not null) {
                Pants = await DB.Pants.FirstOrDefaultAsync(S => S.ID == Request.PantID);
                if (Pants is null) { return NotFound($"Could not find Pants with ID {Request.PantID}"); }
            }

            if (Request.BeltID is not null) {
                Belt = await DB.Belt.FirstOrDefaultAsync(S => S.ID == Request.BeltID);
                if (Belt is null) { return NotFound($"Could not find Belt with ID {Request.BeltID}"); }
            }

            if (Request.ShoesID is not null) {
                Shoes = await DB.Shoes.FirstOrDefaultAsync(S => S.ID == Request.ShoesID);
                if (Shoes is null) { return NotFound($"Could not find Shoes with ID {Request.ShoesID}"); }
            }

            if (Request.SocksID is not null) {
                Socks = await DB.Socks.FirstOrDefaultAsync(S => S.ID == Request.SocksID);
                if (Socks is null) { return NotFound($"Could not find Socks with ID {Request.SocksID}"); }
            }

            Outfit O = new() {
                Accessories = Accessories,
                Belt = Belt,
                Description = Request.Description,
                Name = Request.Name,
                ImageURL = Request.ImageURL,
                Overshirts = Overshirts,
                Owner = P,
                Pants = Pants,
                Shirt = Shirt,
                Shoes = Shoes,
                Socks = Socks,
            };

            DB.Add(O);
            await DB.SaveChangesAsync();

            return Created("",O);

        }

        //Update Outfit (Name, Description)
        /// <summary>Update an outfit</summary>
        /// <param name="Request"></param>
        /// <param name="SessionID">ID of the session executing this request</param>
        /// <returns></returns>
        [HttpPut("Outfits")]
        public async Task<IActionResult> UpdateOutfit([FromHeader] Guid SessionID, [FromBody] NDPEditRequest Request) {

            if (Request.ID is null) { return BadRequest("Outfit ID must not be null"); }

            //Check the session:
            Session? S = await Task.Run(() => SessionManager.Manager.FindSession(SessionID));
            if (S is null) { return Unauthorized("Invalid session"); }

            //Get the outfit:
            Outfit? O = await DB.Outfit //Include these primarily for the frontend
                .Include(O => O.Shirt)
                .Include(O => O.Overshirts)
                .Include(O => O.Pants)
                .Include(O => O.Shoes)
                .Include(O => O.Socks)
                .Include(O => O.Belt)
                .Include(O => O.Accessories)
                .FirstOrDefaultAsync(O => O.ID==Request.ID && 
            O.Owner != null && O.Owner.TiedUser != null && O.Owner.TiedUser.Username == S.UserID);

            if (O is null) { return NotFound("Outfit was not found, or is not owned by a person tied to the owner of this session"); }

            //Update the de-esta cosas
            O.Name = Request.Name ?? O.Name;
            O.Description = Request.Description ?? O.Description;
            O.ImageURL = Request.ImageURL ?? O.ImageURL;

            //Update the DB
            DB.Outfit.Update(O);
            await DB.SaveChangesAsync();

            //Adios
            return Ok(O);
        }

        //Delete outfit
        /// <summary>Mark an outfit as deleted</summary>
        ///<param name="ID">ID of the object to delete</param>
        ///<param name="SessionID">ID of the session executing this request</param>
        /// <returns></returns>
        [HttpDelete("Outfits")]
        public async Task<IActionResult> DeleteOutfit([FromHeader] Guid SessionID, [FromQuery] Guid? ID) {

            if (ID is null) { return BadRequest("Outfit ID must not be null"); }

            //Check the session:
            Session? S = await Task.Run(() => SessionManager.Manager.FindSession(SessionID));
            if (S is null) { return Unauthorized("Invalid session"); }

            //Get the outfit:
            Outfit? O = await DB.Outfit.FirstOrDefaultAsync(O => O.ID == ID &&
            O.Owner != null && O.Owner.TiedUser != null && O.Owner.TiedUser.Username == S.UserID);

            if (O is null) { return NotFound("Outfit was not found, or is not owned by a person tied to the owner of this session"); }

            //Delete the outfit
            O.Deleted = true;

            //Update the DB
            DB.Outfit.Update(O);
            await DB.SaveChangesAsync();

            //Adios
            return Ok(O);

        }

        //Get Log
        /// <summary>Gets a log of the specified person (Sorted in descending date order)</summary>
        /// <param name="PersonID">ID of the person whose logs you wish to get</param>
        /// <param name="Skip">Logs to skip</param>
        /// <param name="Take">Logs to take</param>
        /// <param name="Query">Search query for outfits and wearables</param>
        /// <param name="SessionID">ID of the session executing this request</param>
        /// <returns></returns>
        [HttpGet("Log")]
        public async Task<IActionResult> GetLog([FromHeader] Guid SessionID, [FromQuery] Guid? PersonID, [FromQuery] int? Skip, [FromQuery] int? Take, [FromQuery] string? Query) {

            //Check the session:
            Session? S = await Task.Run(() => SessionManager.Manager.FindSession(SessionID));
            if (S is null) { return Unauthorized("Invalid session"); }

#pragma warning disable CS8602 // Dereference of a possibly null reference.
            IQueryable<LogItem> MostRecentBaseSet = DB.LogItem.Where(L => L.Outfit != null) //This where covers the dereference but VS doesn't recognize it
                .Include(L => L.Outfit).ThenInclude(O => O.Shirt)
                .Include(L => L.Outfit).ThenInclude(O => O.Overshirts)
                .Include(L => L.Outfit).ThenInclude(O => O.Pants)
                .Include(L => L.Outfit).ThenInclude(O => O.Shoes)
                .Include(L => L.Outfit).ThenInclude(O => O.Socks)
                .Include(L => L.Outfit).ThenInclude(O => O.Belt)
                .Include(L => L.Outfit).ThenInclude(O => O.Accessories)
                .Where(O => O.Owner != null && O.Owner.ID == PersonID && O.Owner.TiedUser != null && O.Owner.TiedUser.Username==S.UserID)
                .Where(O=> (O.Note.ToLower().Contains(Query ?? ""))||
                    ((O.Outfit != null && (O.Outfit.Name.ToLower().Contains(Query ?? "") || O.Outfit.Description.ToLower().Contains(Query ?? ""))) ||
                    (O.Outfit.Shirt != null && (O.Outfit.Shirt.Name.ToLower().Contains(Query ?? "") || O.Outfit.Shirt.Description.ToLower().Contains(Query ?? "")))||
                    (O.Outfit.Overshirts != null && (O.Outfit.Overshirts.Any(O=>O.Name.ToLower().Contains(Query ?? "") || O.Description.ToLower().Contains(Query ?? "")))) ||
                    (O.Outfit.Pants != null && (O.Outfit.Pants.Name.ToLower().Contains(Query ?? "") || O.Outfit.Pants.Description.ToLower().Contains(Query ?? ""))) ||
                    (O.Outfit.Shoes != null && (O.Outfit.Shoes.Name.ToLower().Contains(Query ?? "") || O.Outfit.Shoes.Description.ToLower().Contains(Query ?? ""))) ||
                    (O.Outfit.Socks != null && (O.Outfit.Socks.Name.ToLower().Contains(Query ?? "") || O.Outfit.Socks.Description.ToLower().Contains(Query ?? ""))) ||
                    (O.Outfit.Belt != null && (O.Outfit.Belt.Name.ToLower().Contains(Query ?? "") || O.Outfit.Belt.Description.ToLower().Contains(Query ?? ""))) ||
                    (O.Outfit.Accessories != null && (O.Outfit.Accessories.Any(O => O.Name.ToLower().Contains(Query ?? "") || O.Description.ToLower().Contains(Query ?? ""))))
                        )
                    )
                .OrderByDescending(L => L.Date).Skip(Skip ?? 0).Take(Take ?? 20);
#pragma warning restore CS8602 // Dereference of a possibly null reference.

            return Ok(await MostRecentBaseSet.ToListAsync());
        }

        //Add Log
        /// <summary>Add a log</summary>
        /// <param name="Request"></param>
        /// <param name="SessionID">ID of the session executing this request</param>
        /// <returns></returns>
        [HttpPost("Log")]
        public async Task<IActionResult> AddLog([FromHeader] Guid SessionID, [FromBody] AddLogRequest Request) {

            //Check
            if (Request.PersonID is null || Request.OutfitID is null) { return BadRequest("Outfit ID and Person ID must not be null"); }

            //Check the session:
            Session? S = await Task.Run(() => SessionManager.Manager.FindSession(SessionID));
            if (S is null) { return Unauthorized("Invalid session"); }

            //Get the person
            Person? P = await DB.Person.FirstOrDefaultAsync(P => P.ID == Request.PersonID && P.TiedUser != null && P.TiedUser.Username == S.UserID);
            if (P is null) { return NotFound("Person was not found, or is not tied to session owner"); }

            //Get the outfit
            Outfit? O = await DB.Outfit.FirstOrDefaultAsync(O => O.ID == Request.OutfitID && O.Owner != null && O.Owner.ID == Request.PersonID);
            if (O is null) { return NotFound("Outfit was not found, or is not owned by given person"); }

            //Create the log
            LogItem L = new() {
                Date = Request.Date,
                Note = Request.Note,
                Outfit = O,
                Owner = P
            };

            //Add it
            DB.LogItem.Add(L);

            //Save
            await DB.SaveChangesAsync();

            //Get out
            return Created("", L);

        }

        //Get list of most used of each type of wearable (And wearable types)
        //TODO

        //Get list of most used outfits
        /// <summary>Gets a list of most used outfits</summary>
        /// <param name="PersonID">ID of the person whose most used outfits you wish to get</param>
        /// <param name="Skip">Amount of outfits to skip</param>
        /// <param name="Take">Amount of outfits to take</param>
        /// <param name="SessionID">ID of the session executing this request</param>
        /// <returns></returns>
        [HttpGet("Statistics/Outfits")]
        public async Task<IActionResult> MostUsedOutfits([FromHeader] Guid SessionID, [FromQuery] Guid? PersonID, [FromQuery] int? Skip, [FromQuery] int? Take) {

            //Check the session:
            Session? S = await Task.Run(() => SessionManager.Manager.FindSession(SessionID));
            return S is null
                ? Unauthorized("Invalid session")
                : PersonID == null
                ? BadRequest("A person ID is required")
                : Ok(await DB.LogItem.Where(L => L.Owner != null && L.Owner.ID == PersonID && L.Owner.TiedUser != null && L.Owner.TiedUser.Username==S.UserID)
                .GroupBy(L => L.Outfit).Select(G => new { Outfit = G.Key, Count = G.Count()}).OrderByDescending(G => G.Count) //I actually don't know what this'll return so we'll have to see
                .Skip(Skip ?? 0).Take(Take ?? 20).ToListAsync());
        }

        #endregion

    }
}
