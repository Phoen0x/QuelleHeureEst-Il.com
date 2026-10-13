// FR// Régressions du rétroport amont b31265df : conversion vide, propriété et réutilisation.
// EN// Regressions for upstream backport b31265df: empty conversion, ownership and reuse.
#![cfg(target_os = "linux")]
use glib::prelude::*;
use glib::{GStringPtr, PtrSlice, Slice};

fn check_empty_string_slice_can_be_reused(source: Slice<GStringPtr>) {
    let mut converted = PtrSlice::from(source);
    assert!(converted.is_empty());
    assert_eq!(converted.capacity(), 0);
    // FR// as_ptr fournit une sentinelle lisible même pour un conteneur vide.
    // EN// as_ptr supplies a readable sentinel even for an empty container.
    assert!(unsafe { (*converted.as_ptr()).is_null() });

    converted.push(GStringPtr::from("réutilisation"));
    assert_eq!(converted.len(), 1);
    assert_eq!(converted[0].as_str(), "réutilisation");
    assert!(unsafe { (*converted.as_ptr().add(converted.len())).is_null() });
    assert_eq!(converted.pop().unwrap().as_str(), "réutilisation");
    converted.push(GStringPtr::from("second cycle"));
    assert_eq!(converted[0].as_str(), "second cycle");
    drop(converted);
}

#[test]
fn empty_slice_conversion_returns_fresh_reusable_storage() {
    check_empty_string_slice_can_be_reused(Slice::new());
}

#[test]
fn reserved_empty_slice_conversion_discards_freed_capacity() {
    let source = Slice::<GStringPtr>::with_capacity(4);
    assert!(source.is_empty());
    assert!(source.capacity() >= 4);
    check_empty_string_slice_can_be_reused(source);
}

#[test]
fn emptied_reserved_slice_conversion_is_reusable() {
    let mut source = Slice::from(vec![GStringPtr::from("ancien élément")]);
    let capacity = source.capacity();
    drop(source.pop().unwrap());
    assert!(source.is_empty());
    assert_eq!(source.capacity(), capacity);
    check_empty_string_slice_can_be_reused(source);
}

#[test]
fn nonempty_slice_preserves_contents_and_null_termination() {
    // FR// Les trois chaînes correspondent au cas non vide du test amont.
    // EN// The three strings match the nonempty case of the upstream test.
    let items = [
        GStringPtr::from("one"),
        GStringPtr::from("two"),
        GStringPtr::from("three"),
    ];
    let source = Slice::from(&items[..]);
    let mut converted: PtrSlice<GStringPtr> = PtrSlice::from(source);
    drop(items);
    assert_eq!(converted.len(), 3);
    assert_eq!(converted[0].as_str(), "one");
    assert_eq!(converted[1].as_str(), "two");
    assert_eq!(converted[2].as_str(), "three");
    assert!(unsafe { (*converted.as_ptr().add(converted.len())).is_null() });

    converted.truncate(1);
    converted.push(GStringPtr::from("four"));
    assert_eq!(converted.len(), 2);
    assert_eq!(converted[0].as_str(), "one");
    assert_eq!(converted[1].as_str(), "four");
    assert!(unsafe { (*converted.as_ptr().add(converted.len())).is_null() });
    drop(converted);
}

#[test]
fn converted_slice_owns_objects_until_their_last_reference_is_dropped() {
    let object = glib::Object::new::<glib::Object>();
    let weak = object.downgrade();
    let source = Slice::from(vec![object]);
    let mut converted: PtrSlice<glib::Object> = PtrSlice::from(source);
    assert_eq!(converted[0].ref_count(), 1);
    assert!(weak.upgrade().is_some());

    let owned = converted.pop().unwrap();
    assert!(converted.is_empty());
    assert!(weak.upgrade().is_some());
    drop(owned);
    assert!(weak.upgrade().is_none());

    // FR// Une autre Slice vide réservée doit perdre sa capacité après la conversion et sa libération.
    // EN// Another reserved empty Slice must lose its capacity after conversion and deallocation.
    let reserved_empty: Slice<glib::Object> = Slice::with_capacity(8);
    let mut reused: PtrSlice<glib::Object> = PtrSlice::from(reserved_empty);
    assert_eq!(reused.capacity(), 0);
    let replacement = glib::Object::new::<glib::Object>();
    let replacement_weak = replacement.downgrade();
    reused.push(replacement);
    assert_eq!(reused[0].ref_count(), 1);
    drop(reused);
    assert!(replacement_weak.upgrade().is_none());
    drop(converted);
}

#[test]
fn converting_then_truncating_finalizes_each_owned_object() {
    let first = glib::Object::new::<glib::Object>();
    let second = glib::Object::new::<glib::Object>();
    let first_weak = first.downgrade();
    let second_weak = second.downgrade();
    let source = Slice::from(vec![first, second]);
    let mut converted: PtrSlice<glib::Object> = PtrSlice::from(source);
    converted.truncate(1);
    assert!(second_weak.upgrade().is_none());
    assert!(first_weak.upgrade().is_some());
    drop(converted);
    assert!(first_weak.upgrade().is_none());
}
