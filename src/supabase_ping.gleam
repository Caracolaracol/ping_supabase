import dotenv
import gleam/erlang/os
import gleam/http
import gleam/option.{None, Option, Some}
import gleam/result.{Error, Ok, Result}

pub fn ping_supabase() -> Result(String, String) {
  dotenv.config_with(".env")
  // this should load .env file
  let supabase_url = os.get_env("SUPABASE_URL")
  let supabase_key = os.get_env("SUPABASE_KEY")
  let supabase_table = os.get_env("SUPABASE_TABLE")
  let headers =
    http.headers([
      "apikey",
      supabase_key,
      "Authorization",
      "Bearer " <> supabase_key,
    ])

  let request =
    http.get(
      supabase_url <> "/rest/v1/" <> supabase_table <> "?select=id&limit=1",
      headers,
    )

  case http.send(request) {
    Ok(response) ->
      case response.status == 200 {
        True -> Ok("Ping to Supabase successful!")
        False ->
          Error(
            "Failed to ping Supabase: Status code "
            <> int_to_string(response.status),
          )
      }

    Error(e) -> Error("Error sending request: " <> e)
  }
}
