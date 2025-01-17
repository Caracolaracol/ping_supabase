import dot_env as dot
import dot_env/env
import gleam/fetch
import gleam/http/request
import gleam/http/response
import gleam/io
import gleam/javascript/promise
import gleam/result.{try}

pub fn main() {
  dot.new()
  dot.load_default()

  let table_name = env.get_string_or("TABLE_NAME", "")
  let supabase_key = env.get_string_or("SUPABASE_KEY", "")
  let supabase_url = env.get_string_or("SUPABASE_URL", "")

  let url = supabase_url <> "/rest/v1/" <> table_name <> "?select=*"

  let req = case request.to(url) {
    Ok(req) -> req
    Error(e) -> {
      io.println("Error creating request")
      // Return a default request or handle the error appropriately
      request.new()
    }
  }
  let req = request.set_header(req, "apikey", supabase_key)

  // Send the HTTP request to the server
  use resp <- promise.try_await(fetch.send(req))
  use resp <- promise.try_await(fetch.read_text_body(resp))

  // We get a response record back

  // -> 200
  io.println(resp.body)

  let _ = response.get_header(resp, "content-type")
  // -> Ok("text/html; charset=UTF-8")

  promise.resolve(Ok(Nil))
}
