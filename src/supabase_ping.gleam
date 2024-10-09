import dot_env as dot
import dot_env/env
import gleam/hackney
import gleam/http
import gleam/http/request
import gleam/result.{try}

pub fn main() {
  dot.new()
  dot.load_default()

  let table_name = env.get_string_or("TABLE_NAME", "")
  let supabase_key = env.get_string_or("SUPABASE_KEY", "")
  let supabase_url = env.get_string_or("SUPABASE_URL", "")

  let assert Ok(request) =
    request.to(
      supabase_url <> "/rest/v1/" <> table_name <> "?select=id&limit=1",
    )

  use response <- try(
    request
    |> request.set_header("authorization", "Bearer " <> supabase_key)
    |> request.set_header("apikey", supabase_key)
    |> request.set_method(http.Post)
    |> hackney.send,
  )

  Ok(response)
}
