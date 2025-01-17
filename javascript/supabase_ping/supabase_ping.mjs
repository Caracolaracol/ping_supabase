import * as $dot from "../dot_env/dot_env.mjs";
import * as $env from "../dot_env/dot_env/env.mjs";
import * as $fetch from "../gleam_fetch/gleam/fetch.mjs";
import * as $request from "../gleam_http/gleam/http/request.mjs";
import * as $response from "../gleam_http/gleam/http/response.mjs";
import * as $promise from "../gleam_javascript/gleam/javascript/promise.mjs";
import * as $io from "../gleam_stdlib/gleam/io.mjs";
import * as $result from "../gleam_stdlib/gleam/result.mjs";
import { try$ } from "../gleam_stdlib/gleam/result.mjs";
import { Ok } from "./gleam.mjs";

export default function main() {
  $dot.new$();
  $dot.load_default();
  let table_name = $env.get_string_or("TABLE_NAME", "");
  let supabase_key = $env.get_string_or("SUPABASE_KEY", "");
  let supabase_url = $env.get_string_or("SUPABASE_URL", "");
  let url = ((supabase_url + "/rest/v1/") + table_name) + "?select=*";
  let req = (() => {
    let $ = $request.to(url);
    if ($.isOk()) {
      let req = $[0];
      return req;
    } else {
      let e = $[0];
      $io.println("Error creating request");
      return $request.new$();
    }
  })();
  let req$1 = $request.set_header(req, "apikey", supabase_key);
  return $promise.try_await(
    $fetch.send(req$1),
    (resp) => {
      return $promise.try_await(
        $fetch.read_text_body(resp),
        (resp) => {
          $io.println(resp.body);
          let $ = $response.get_header(resp, "content-type");
          return $promise.resolve(new Ok(undefined));
        },
      );
    },
  );
}
