import "../stylesheets/Error.css";


//Will return an error screen when called
function Error({error}){
    return (
        <>
          <div className="container-md">
            <h1>⚠️ An error has occured: {error}. </h1>
          </div>
        </>
      );
}

export default Error;