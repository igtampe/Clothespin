using Microsoft.AspNetCore.Mvc;
using Igtampe.Clothespin.Common.Tracking;
using Igtampe.Clothespin.Common.Clothes;
using Igtampe.Clothespin.Common.Clothes.Items;
using Igtampe.Clothespin.Common.Clothes.Types;
using Igtampe.Clothespin.Data;
using Igtampe.ChopoSessionManager;
using Microsoft.EntityFrameworkCore;
using System.Reflection;

namespace Igtampe.Clothespin.API.Controllers {

    /// <summary>Controller that handles all operations for Clothes</summary>
    [Route("API/Clothes")]
    [ApiController]
    public class ClothesController : ControllerBase {

        #region Private vars

        private enum GetResult { SUCCESS = 0, ID_MISSING = 1, INVALID_SESSION = 2, NOT_FOUND = 3, NOT_FOUND_PERSON = 4 }

        private static IActionResult[] ResultDictionary = Array.Empty<IActionResult>();

        private readonly ClothespinContext DB;

        #endregion

        #region Constructor

        /// <summary>Creates a Clothes Controller</summary>
        /// <param name="Context"></param>
        public ClothesController(ClothespinContext Context) {

            IActionResult OK = Ok();
            IActionResult BR = BadRequest("ID is required");
            IActionResult IS = Unauthorized("Invalid session provided");
            IActionResult NFW = NotFound("Requested wearable was either not found, or does not belong to a person tied to the session owner");
            IActionResult NFP = NotFound("Requested person was either not found, or is not tied to the session owner");

            ResultDictionary = new List<IActionResult>(){ OK, BR, IS, NFW, NFP }.ToArray() ;

            DB = Context; 

        }

        #endregion

        //Get every type of wearable
        #region Gets

        //Get Accessories
        /// <summary>Gets a specified accessory</summary>
        /// <param name="SessionID">ID of the session executing this request</param>
        /// <param name="ID">ID of the item you wish to retrieve</param>
        /// <returns></returns>
        [HttpGet("Accessory")]
        public async Task<IActionResult> GetAccessory([FromHeader] Guid SessionID, [FromQuery] Guid? ID)
            => (await GetWearable<Accessory, AccessoryType>(DB.Accessory, SessionID, ID)).Item3;

        //Get Belt
        /// <summary>Gets a specified Belt</summary>
        /// <param name="SessionID">ID of the session executing this request</param>
        /// <param name="ID">ID of the item you wish to retrieve</param>
        /// <returns></returns>
        [HttpGet("Belt")]
        public async Task<IActionResult> GetBelt([FromHeader] Guid SessionID, [FromQuery] Guid? ID)
            => (await GetWearable<Belt, BeltType>(DB.Belt, SessionID, ID)).Item3;

        //Get Overshirts
        /// <summary>Gets a specified overshirt</summary>
        /// <param name="SessionID">ID of the session executing this request</param>
        /// <param name="ID">ID of the item you wish to retrieve</param>
        /// <returns></returns>
        [HttpGet("Overshirt")]
        public async Task<IActionResult> GetOvershirt([FromHeader] Guid SessionID, [FromQuery] Guid? ID)
            => (await GetWearable<Overshirt, OvershirtType>(DB.Overshirt, SessionID, ID)).Item3;

        //Get Pants
        /// <summary>Gets a specified pair of pants</summary>
        /// <param name="SessionID">ID of the session executing this request</param>
        /// <param name="ID">ID of the item you wish to retrieve</param>
        /// <returns></returns>
        [HttpGet("Pants")]
        public async Task<IActionResult> GetPants([FromHeader] Guid SessionID, [FromQuery] Guid? ID)
            => (await GetWearable<Pants, PantsType>(DB.Pants, SessionID, ID)).Item3;

        //Get Shirts
        /// <summary>Gets a specified shirt</summary>
        /// <param name="SessionID">ID of the session executing this request</param>
        /// <param name="ID">ID of the item you wish to retrieve</param>
        /// <returns></returns>
        [HttpGet("Shirt")]
        public async Task<IActionResult> GetShirt([FromHeader] Guid SessionID, [FromQuery] Guid? ID)
            => (await GetWearable<Shirt, ShirtType>(DB.Shirt, SessionID, ID)).Item3;

        //Get Shoes
        /// <summary>Gets a specified pair of shoes</summary>
        /// <param name="SessionID">ID of the session executing this request</param>
        /// <param name="ID">ID of the item you wish to retrieve</param>
        /// <returns></returns>
        [HttpGet("Shoes")]
        public async Task<IActionResult> GetShoes([FromHeader] Guid SessionID, [FromQuery] Guid? ID)
            => (await GetWearable<Shoes, ShoeType>(DB.Shoes, SessionID, ID)).Item3;

        //Get Socks
        /// <summary>Gets a specified pair of socks</summary>
        /// <param name="SessionID">ID of the session executing this request</param>
        /// <param name="ID">ID of the item you wish to retrieve</param>
        /// <returns></returns>
        [HttpGet("Socks")]
        public async Task<IActionResult> GetSocks([FromHeader] Guid SessionID, [FromQuery] Guid? ID)
            => (await GetWearable<Socks, SockType>(DB.Socks, SessionID, ID)).Item3;

        /// <summary>Helper function to get any type of wearable from the DB</summary>
        /// <typeparam name="E"></typeparam>
        /// <typeparam name="F"></typeparam>
        /// <param name="InitialCollection"></param>
        /// <param name="SessionID"></param>
        /// <param name="ID"></param>
        /// <returns></returns>
        [NonAction] //LOOK AT ME USING TUPLES I FEEL SO SMART (oh my god)
        private async Task<(GetResult, E?, IActionResult)> GetWearable<E, F>(IQueryable<E> InitialCollection, Guid SessionID, Guid? ID) where E : Wearable<F> where F : Enum {
            if (ID is null) { return (GetResult.ID_MISSING,null,ResultDictionary[(int)GetResult.ID_MISSING]); }

            //Get the session
            Session? S = SessionManager.Manager.FindSession(SessionID);
            if (S is null) { return (GetResult.INVALID_SESSION, null, ResultDictionary[(int)GetResult.ID_MISSING]); }

            //Get the Wearable
            E? Item = await InitialCollection.FirstOrDefaultAsync(I => I.ID == ID && I.Owner != null && I.Owner.TiedUser != null && I.Owner.TiedUser.Username == S.UserID);
            return (Item is null ? GetResult.NOT_FOUND : GetResult.SUCCESS, 
                Item, 
                Item is null ? ResultDictionary[(int)GetResult.NOT_FOUND] : 
            Ok(Item)); //This makes me feel like *way* more of a genius than it should lmao
        }

        #endregion

        //Create every type of wearable
        #region Creates

        //Create Accessories
        /// <summary>Create an Accessory</summary>
        /// <param name="SessionID">ID of the session executing this request</param>
        /// <param name="PersonID">Person this new item will belong to</param>
        /// <param name="Item">Item you wish to add</param>
        /// <returns></returns>
        [HttpPost("Accessory")]
        public async Task<IActionResult> CreateAccessory([FromHeader] Guid SessionID, [FromQuery] Guid PersonID, [FromBody] Accessory Item)
            => await CreateWearable<Accessory, AccessoryType>(SessionID, PersonID, Item);

        //Create Belt
        /// <summary>Create a Belt</summary>
        /// <param name="SessionID">ID of the session executing this request</param>
        /// <param name="PersonID">Person this new item will belong to</param>
        /// <param name="Item">Item you wish to add</param>
        /// <returns></returns>
        [HttpPost("Belt")]
        public async Task<IActionResult> CreateBelt([FromHeader] Guid SessionID, [FromQuery] Guid PersonID, [FromBody] Belt Item)
            => await CreateWearable<Belt, BeltType>(SessionID, PersonID, Item);

        //Create Overshirt
        /// <summary>Create an Overshirt</summary>
        /// <param name="SessionID">ID of the session executing this request</param>
        /// <param name="PersonID">Person this new item will belong to</param>
        /// <param name="Item">Item you wish to add</param>
        /// <returns></returns>
        [HttpPost("Overshirt")]
        public async Task<IActionResult> CreateOvershirt([FromHeader] Guid SessionID, [FromQuery] Guid PersonID, [FromBody] Overshirt Item)
                    => await CreateWearable<Overshirt, OvershirtType>(SessionID, PersonID, Item);

        //Create Pants
        /// <summary>Create a pair of pants</summary>
        /// <param name="SessionID">ID of the session executing this request</param>
        /// <param name="PersonID">Person this new item will belong to</param>
        /// <param name="Item">Item you wish to add</param>
        /// <returns></returns>
        [HttpPost("Pants")]
        public async Task<IActionResult> CreatePants([FromHeader] Guid SessionID, [FromQuery] Guid PersonID, [FromBody] Pants Item)
                    => await CreateWearable<Pants, PantsType>(SessionID, PersonID, Item);

        //Create Shirts
        /// <summary>Create a Shirt</summary>
        /// <param name="SessionID">ID of the session executing this request</param>
        /// <param name="PersonID">Person this new item will belong to</param>
        /// <param name="Item">Item you wish to add</param>
        /// <returns></returns>
        [HttpPost("Shirt")]
        public async Task<IActionResult> CreateShirts([FromHeader] Guid SessionID, [FromQuery] Guid PersonID, [FromBody] Shirt Item)
                    => await CreateWearable<Shirt, ShirtType>(SessionID, PersonID, Item);

        //Create Shoes
        /// <summary>Create a pair of shoes</summary>
        /// <param name="SessionID">ID of the session executing this request</param>
        /// <param name="PersonID">Person this new item will belong to</param>
        /// <param name="Item">Item you wish to add</param>
        /// <returns></returns>
        [HttpPost("Shoes")]
        public async Task<IActionResult> CreateShoes([FromHeader] Guid SessionID, [FromQuery] Guid PersonID, [FromBody] Shoes Item)
                    => await CreateWearable<Shoes, ShoeType>(SessionID, PersonID, Item);

        //Create Socks
        /// <summary>Create a Sock</summary>
        /// <param name="SessionID">ID of the session executing this request</param>
        /// <param name="PersonID">Person this new item will belong to</param>
        /// <param name="Item">Item you wish to add</param>
        /// <returns></returns>
        [HttpPost("Socks")]
        public async Task<IActionResult> CreateSocks([FromHeader] Guid SessionID, [FromQuery] Guid PersonID, [FromBody] Socks Item)
                    => await CreateWearable<Socks, SockType>(SessionID, PersonID, Item);

        /// <summary>Helper function to create any type of wearable</summary>
        /// <typeparam name="E"></typeparam>
        /// <typeparam name="F"></typeparam>
        /// <param name="SessionID"></param>
        /// <param name="PersonID"></param>
        /// <param name="Wearable"></param>
        /// <returns></returns>
        [NonAction]
        private async Task<IActionResult> CreateWearable<E, F>(Guid SessionID, Guid PersonID, E Wearable) where E : Wearable<F> where F : Enum {

            //Check the session
            //Get the session
            Session? S = SessionManager.Manager.FindSession(SessionID);
            if (S is null) { return ResultDictionary[(int)GetResult.INVALID_SESSION]; }

            //Get the person
            Person? P = await DB.Person.FirstOrDefaultAsync(P => P.ID == PersonID && P.TiedUser != null && P.TiedUser.Username == S.UserID);
            if (P is null) { return ResultDictionary[(int)GetResult.NOT_FOUND_PERSON]; }

            //Link the two,
            Wearable.Owner = P;

            //Ensure the ID is empty
            Wearable.ID = Guid.Empty;

            //Add it to the DB
            DB.Add(Wearable);

            //Send it
            await DB.SaveChangesAsync();

            //Adios
            return Created($"/API/Clothes/{typeof(E).Name}?ID={Wearable.ID}",Wearable);

        }

        #endregion

        //Modify every type of wearable
        #region Updates

        //Modify Accessory
        /// <summary>Updates an Accessory</summary>
        /// <param name="SessionID">ID of the session executing the request</param>
        /// <param name="ID">ID of the Item you wish to update</param>
        /// <param name="Item"></param>
        /// <returns></returns>
        [HttpPut("Accessory")]
        public async Task<IActionResult> UpdateAccesory([FromHeader] Guid SessionID, [FromQuery] Guid ID, [FromBody] Accessory Item)
            => await UpdateWearable<Accessory, AccessoryType>(DB.Accessory, SessionID, ID, Item);

        //Modify Belt
        /// <summary>Updates a Belt</summary>
        /// <param name="SessionID">ID of the session executing the request</param>
        /// <param name="ID">ID of the Item you wish to update</param>
        /// <param name="Item"></param>
        /// <returns></returns>
        [HttpPut("Belt")]
        public async Task<IActionResult> UpdateBelt([FromHeader] Guid SessionID, [FromQuery] Guid ID, [FromBody] Accessory Item)
            => await UpdateWearable<Accessory, AccessoryType>(DB.Accessory, SessionID, ID, Item);

        //Modify Overshirt
        /// <summary>Updates an Overshirt</summary>
        /// <param name="SessionID">ID of the session executing the request</param>
        /// <param name="ID">ID of the Item you wish to update</param>
        /// <param name="Item"></param>
        /// <returns></returns>
        [HttpPut("Overshirt")]
        public async Task<IActionResult> UpdateOvershirt([FromHeader] Guid SessionID, [FromQuery] Guid ID, [FromBody] Accessory Item)
            => await UpdateWearable<Accessory, AccessoryType>(DB.Accessory, SessionID, ID, Item);

        //Modify Pants
        /// <summary>Updates a pair of pants</summary>
        /// <param name="SessionID">ID of the session executing the request</param>
        /// <param name="ID">ID of the Item you wish to update</param>
        /// <param name="Item"></param>
        /// <returns></returns>
        [HttpPut("Pants")]
        public async Task<IActionResult> UpdatePants([FromHeader] Guid SessionID, [FromQuery] Guid ID, [FromBody] Accessory Item)
            => await UpdateWearable<Accessory, AccessoryType>(DB.Accessory, SessionID, ID, Item);

        //Modify Shirt
        /// <summary>Updates a Shirt</summary>
        /// <param name="SessionID">ID of the session executing the request</param>
        /// <param name="ID">ID of the Item you wish to update</param>
        /// <param name="Item"></param>
        /// <returns></returns>
        [HttpPut("Shirt")]
        public async Task<IActionResult> UpdateShirt([FromHeader] Guid SessionID, [FromQuery] Guid ID, [FromBody] Accessory Item)
            => await UpdateWearable<Accessory, AccessoryType>(DB.Accessory, SessionID, ID, Item);

        //Modify Shoes
        /// <summary>Updates a Pair of Shoes</summary>
        /// <param name="SessionID">ID of the session executing the request</param>
        /// <param name="ID">ID of the Item you wish to update</param>
        /// <param name="Item"></param>
        /// <returns></returns>
        [HttpPut("Shoes")]
        public async Task<IActionResult> UpdateShoes([FromHeader] Guid SessionID, [FromQuery] Guid ID, [FromBody] Accessory Item)
            => await UpdateWearable<Accessory, AccessoryType>(DB.Accessory, SessionID, ID, Item);

        //Modify Socks
        /// <summary>Updates a pair of socks</summary>
        /// <param name="SessionID">ID of the session executing the request</param>
        /// <param name="ID">ID of the Item you wish to update</param>
        /// <param name="Item"></param>
        /// <returns></returns>
        [HttpPut("Socks")]
        public async Task<IActionResult> UpdateSocks([FromHeader] Guid SessionID, [FromQuery] Guid ID, [FromBody] Accessory Item)
            => await UpdateWearable<Accessory, AccessoryType>(DB.Accessory, SessionID, ID, Item);

        /// <summary>Helper function to update any and all properties of a wearable</summary>
        /// <typeparam name="E"></typeparam>
        /// <typeparam name="F"></typeparam>
        /// <param name="InitialCollection"></param>
        /// <param name="SessionID"></param>
        /// <param name="ID"></param>
        /// <param name="Wearable"></param>
        /// <returns></returns>
        [NonAction]
        private async Task<IActionResult> UpdateWearable<E, F>(IQueryable<E> InitialCollection, Guid SessionID, Guid? ID, E Wearable) where E : Wearable<F> where F : Enum {

            var Get = await GetWearable<E, F>(InitialCollection, SessionID, ID);
            if (Get.Item1 != GetResult.SUCCESS || Get.Item2 is null) { return Get.Item3; } //LOOK AT THIS BEAUTY OH MY GOD!!!!!

            //Now proceed all our work on Item2.

            //Get each property in E, and update it accordingly.
            foreach (PropertyInfo Prop in typeof(E).GetProperties()) {

                //Check for the properties we need to skip
                switch (Prop.Name.ToUpper()) {
                    case "ID":
                    case "OUTFITS":
                    case "OWNER":
                        continue;
                    default:
                        break;
                }

                //Get the updated value
                string? O = (string?)Prop.GetValue(Wearable);

                //Update the value as long as its not null or whitespace
                if (!string.IsNullOrWhiteSpace(O)) {Prop.SetValue(Get.Item2, O); }

                //This alone should be able to handle any type of wearable, washable, and even sizeable creo.
                //Which good god, has made this one of the most *powerful* methods I have written :flushed:
            }

            //Now let's update
            DB.Update(Get.Item2);
            await DB.SaveChangesAsync();

            return Ok(Get.Item2);

        }

        #endregion

        //Mark every type of wearable as deleted
        #region Deletes

        //Delete Accessory
        /// <summary>Marks an accessory as deleted</summary>
        /// <param name="SessionID">ID of the session executing this request</param>
        /// <param name="ID">ID of the item to mark deleted</param>
        /// <returns></returns>
        [HttpDelete("Accessory")]
        public async Task<IActionResult> DeleteAccessory([FromHeader] Guid SessionID, [FromQuery] Guid ID)
            => await DeleteWearable<Accessory,AccessoryType>(DB.Accessory, SessionID, ID);

        //Delete Belt
        /// <summary>Marks a belt as deleted</summary>
        /// <param name="SessionID">ID of the session executing this request</param>
        /// <param name="ID">ID of the item to mark deleted</param>
        /// <returns></returns>
        [HttpDelete("Belt")]
        public async Task<IActionResult> DeleteBelt([FromHeader] Guid SessionID, [FromQuery] Guid ID)
            => await DeleteWearable<Belt, BeltType>(DB.Belt, SessionID, ID);

        //Delete Overshirt
        /// <summary>Marks an overshirt as deleted</summary>
        /// <param name="SessionID">ID of the session executing this request</param>
        /// <param name="ID">ID of the item to mark deleted</param>
        /// <returns></returns>
        [HttpDelete("Overshirt")]
        public async Task<IActionResult> DeleteOvershirt([FromHeader] Guid SessionID, [FromQuery] Guid ID)
            => await DeleteWearable<Overshirt, OvershirtType>(DB.Overshirt, SessionID, ID);

        //Delete Pant
        /// <summary>Marks a pair of pants as deleted</summary>
        /// <param name="SessionID">ID of the session executing this request</param>
        /// <param name="ID">ID of the item to mark deleted</param>
        /// <returns></returns>
        [HttpDelete("Pants")]
        public async Task<IActionResult> DeletePants([FromHeader] Guid SessionID, [FromQuery] Guid ID)
            => await DeleteWearable<Pants, PantsType>(DB.Pants, SessionID, ID);

        //Delete Shirt
        /// <summary>Marks a shirt as deleted</summary>
        /// <param name="SessionID">ID of the session executing this request</param>
        /// <param name="ID">ID of the item to mark deleted</param>
        /// <returns></returns>
        [HttpDelete("Shirt")]
        public async Task<IActionResult> DeleteShirt([FromHeader] Guid SessionID, [FromQuery] Guid ID)
            => await DeleteWearable<Shirt, ShirtType>(DB.Shirt, SessionID, ID);

        //Delete Shoes
        /// <summary>Marks a pair of shoes as deleted</summary>
        /// <param name="SessionID">ID of the session executing this request</param>
        /// <param name="ID">ID of the item to mark deleted</param>
        /// <returns></returns>
        [HttpDelete("Shoes")]
        public async Task<IActionResult> DeleteShoes([FromHeader] Guid SessionID, [FromQuery] Guid ID)
            => await DeleteWearable<Shoes, ShoeType>(DB.Shoes, SessionID, ID);

        //Delete Socks
        /// <summary>Marks a pair of socks as deleted</summary>
        /// <param name="SessionID">ID of the session executing this request</param>
        /// <param name="ID">ID of the item to mark deleted</param>
        /// <returns></returns>
        [HttpDelete("Socks")]
        public async Task<IActionResult> DeleteSocks([FromHeader] Guid SessionID, [FromQuery] Guid ID)
            => await DeleteWearable<Socks, SockType>(DB.Socks, SessionID, ID);

        /// <summary>Helper function to mark any wearable as deleted</summary>
        /// <typeparam name="E"></typeparam>
        /// <typeparam name="F"></typeparam>
        /// <param name="InitialCollection"></param>
        /// <param name="SessionID"></param>
        /// <param name="ID"></param>
        /// <returns></returns>
        [NonAction]
        private async Task<IActionResult> DeleteWearable<E, F>(IQueryable<E> InitialCollection, Guid SessionID, Guid? ID) where E : Wearable<F> where F : Enum {

            var Get = await GetWearable<E, F>(InitialCollection, SessionID, ID);
            if (Get.Item1 != GetResult.SUCCESS || Get.Item2 is null) { return Get.Item3; } //LOOK AT THIS BEAUTY OH MY GOD!!!!!
            //Get ITEM 2 is never going to be null if Success is responded, pero this shuts intellisense up because we make sure.

            //Mark it deleted
            Get.Item2.Deleted = true;

            //Save the changes
            DB.Update(Get.Item2);
            await DB.SaveChangesAsync();

            //Adios
            return Ok(Get.Item2);
            
        }

        #endregion

        //Get every wearable's types
        #region Types

        //These don't need to be async because they should be fast enough... no?

        /// <summary>Gets all types of accessories</summary>
        /// <returns></returns>
        [HttpGet("Types/Accessories")]
        public IActionResult GetAccessoryTypes() => GetEnumNameList<AccessoryType>();
        
        /// <summary>Gets all types of shoes</summary>
        /// <returns></returns>
        [HttpGet("Types/Shoes")]
        public IActionResult GetShoeTypes() => GetEnumNameList<ShoeType>();

        /// <summary>Get all types of socks</summary>
        /// <returns></returns>
        [HttpGet("Types/Socks")]
        public IActionResult GetSockTypes() => GetEnumNameList<SockType>();

        /// <summary>Gets all types of overshirts</summary>
        /// <returns></returns>
        [HttpGet("Types/Overshirts")]
        public IActionResult GetOvershirtTypes() => GetEnumNameList<OvershirtType>();

        /// <summary>Gets all types of shirts</summary>
        /// <returns></returns>
        [HttpGet("Types/Shirts")]
        public IActionResult GetShirtTypes() => GetEnumNameList<ShirtType>();

        /// <summary>Gets all types of belts</summary>
        /// <returns></returns>
        [HttpGet("Types/Belts")]
        public IActionResult GetBeltTypes() => GetEnumNameList<BeltType>();

        /// <summary>Gets all types of pants</summary>
        /// <returns></returns>
        [HttpGet("Types/Pants")]
        public IActionResult GetPantsTypes() => GetEnumNameList<PantsType>();

        [NonAction]
        private IActionResult GetEnumNameList<E>() where E : Enum {
            List<string> Names = Enum.GetNames(typeof(E)).ToList();
            Names.ForEach(N => N = N.Replace("_", " "));
            return Ok(Names);
        }

        #endregion

    }
}
