// FR// Contrats concrets des chemins CodeQL : conversions typées et propriété GLib.
// EN// Concrete CodeQL path contracts: typed conversions and GLib ownership.
#![cfg(target_os = "linux")]
use glib::prelude::*;

#[test]
fn uuid_predicate_and_log_level_use_distinct_conversions() {
    let valid: bool = glib::uuid_string_is_valid("550e8400-e29b-41d4-a716-446655440000");
    let invalid: bool = glib::uuid_string_is_valid("not-a-uuid");
    assert!(valid);
    assert!(!invalid);

    let flags: u32 = glib::translate::IntoGlib::into_glib(glib::LogLevel::Debug);
    let level: glib::LogLevel = unsafe { glib::translate::from_glib(flags) };
    assert_eq!(level, glib::LogLevel::Debug);
}

#[test]
fn ffi_charset_output_has_its_concrete_string_type() {
    let (_is_utf8, encoding): (bool, Option<&'static glib::GStr>) = glib::charset();
    let encoding = encoding.expect("GLib supplies a charset name");
    assert!(!encoding.to_string().is_empty());
}

#[test]
fn ffi_error_output_has_its_concrete_error_type() {
    let error: glib::Error = glib::filename_to_uri("relative-name", None)
        .expect_err("A relative filename cannot become a file URI");
    let copy = error.clone();
    drop(error);
    assert!(!copy.message().is_empty());
}

#[test]
fn gvalue_copy_remains_valid_after_source_drop() {
    let source = String::from("QH CodeQL ownership").to_value();
    let copy = source.clone();
    drop(source);
    assert_eq!(copy.get::<String>().unwrap(), "QH CodeQL ownership");
    drop(copy);

    let zero = glib::Value::for_value_type::<i32>();
    assert_eq!(zero.get::<i32>().unwrap(), 0);
    drop(zero);
}

#[test]
fn boxed_gvalue_keeps_its_owned_copy() {
    let original = glib::BoxedValue(String::from("QH boxed ownership").to_value());
    let value = original.to_value();
    drop(original);
    let owned: glib::BoxedValue = value.get().unwrap();
    drop(value);
    assert_eq!(owned.0.get::<String>().unwrap(), "QH boxed ownership");
}
