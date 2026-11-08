// FR// Régressions de VariantStrIter, également exécutées avec optimisations release.
// EN// VariantStrIter regressions, also run with release optimizations.
#![cfg(target_os = "linux")]
use glib::prelude::*;

fn sample() -> glib::Variant {
    ["Paris", "Été", ""].to_variant()
}

#[test]
fn forward_next_reads_written_pointer() {
    let value = sample();
    let mut iter = value.array_iter_str().unwrap();
    assert_eq!(iter.next(), Some("Paris"));
    assert_eq!(iter.next(), Some("Été"));
    assert_eq!(iter.next(), Some(""));
    assert_eq!(iter.next(), None);
}

#[test]
fn forward_nth_reads_written_pointer() {
    let value = sample();
    let mut iter = value.array_iter_str().unwrap();
    assert_eq!(iter.nth(1), Some("Été"));
    assert_eq!(iter.next(), Some(""));
    assert_eq!(iter.nth(usize::MAX), None);
}

#[test]
fn forward_last_reads_written_pointer() {
    let value = sample();
    assert_eq!(value.array_iter_str().unwrap().last(), Some(""));
}

#[test]
fn backward_next_reads_written_pointer() {
    let value = sample();
    let mut iter = value.array_iter_str().unwrap();
    assert_eq!(iter.next_back(), Some(""));
    assert_eq!(iter.next_back(), Some("Été"));
    assert_eq!(iter.next_back(), Some("Paris"));
    assert_eq!(iter.next_back(), None);
}

#[test]
fn backward_nth_reads_written_pointer() {
    let value = sample();
    let mut iter = value.array_iter_str().unwrap();
    assert_eq!(iter.nth_back(1), Some("Été"));
    assert_eq!(iter.next_back(), Some("Paris"));
    assert_eq!(iter.nth_back(usize::MAX), None);
}

#[test]
fn mixed_iteration_and_empty_array_remain_valid() {
    let value = sample();
    let mut iter = value.array_iter_str().unwrap();
    assert_eq!(iter.len(), 3);
    assert_eq!(iter.next(), Some("Paris"));
    assert_eq!(iter.next_back(), Some(""));
    assert_eq!(iter.next(), Some("Été"));
    assert_eq!(iter.len(), 0);
    assert_eq!(iter.next_back(), None);
    let empty: [&str; 0] = [];
    let value = empty.to_variant();
    assert_eq!(value.array_iter_str().unwrap().next(), None);
}
