// FR// Contrats des trois chemins SARIF restants : références GObject et allocation PtrSlice.
// EN// Contracts for the three remaining SARIF paths: GObject references and PtrSlice allocation.
#![cfg(target_os = "linux")]
use glib::prelude::*;
use glib::translate::{from_glib_full, from_glib_none, ToGlibPtr};

#[test]
fn object_none_conversion_adds_an_owned_reference() {
    let original = glib::Object::new::<glib::Object>();
    let weak = original.downgrade();
    assert_eq!(original.ref_count(), 1);
    let pointer: *mut glib::gobject_ffi::GObject = original.to_glib_none().0;

    // FR// L'original possède une référence vivante ; la conversion none en acquiert une autre.
    // EN// The original owns a live reference; the none conversion acquires another one.
    let copy: glib::Object = unsafe { from_glib_none(pointer) };
    assert_eq!(original.ref_count(), 2);
    drop(original);
    assert_eq!(copy.ref_count(), 1);
    assert!(weak.upgrade().is_some());
    drop(copy);
    assert!(weak.upgrade().is_none());
}

#[test]
fn object_full_conversion_transfers_exactly_one_reference() {
    let original = glib::Object::new::<glib::Object>();
    let weak = original.downgrade();
    let pointer: *mut glib::gobject_ffi::GObject = original.to_glib_full();
    assert_eq!(original.ref_count(), 2);

    // FR// to_glib_full crée une référence possédée ; from_glib_full la consomme une seule fois.
    // EN// to_glib_full creates an owned reference; from_glib_full consumes it exactly once.
    let owned: glib::Object = unsafe { from_glib_full(pointer) };
    assert_eq!(original.ref_count(), 2);
    drop(original);
    assert_eq!(owned.ref_count(), 1);
    drop(owned);
    assert!(weak.upgrade().is_none());
}

#[test]
fn null_hostname_uses_a_nullable_string_conversion() {
    let (path, hostname): (std::path::PathBuf, Option<glib::GString>) =
        glib::filename_from_uri("file:///tmp/qh-codeql-contract").unwrap();
    assert_eq!(path, std::path::PathBuf::from("/tmp/qh-codeql-contract"));
    assert!(hostname.is_none());
}

#[test]
fn ptr_slice_truncate_drops_objects_and_preserves_array_storage() {
    let first = glib::Object::new::<glib::Object>();
    let second = glib::Object::new::<glib::Object>();
    let third = glib::Object::new::<glib::Object>();
    let first_weak = first.downgrade();
    let second_weak = second.downgrade();
    let third_weak = third.downgrade();
    let mut objects = glib::PtrSlice::from(vec![first, second, third]);
    let allocation = objects.as_ptr();
    let capacity = objects.capacity();

    objects.truncate(1);
    assert_eq!(objects.len(), 1);
    assert_eq!(objects.as_ptr(), allocation);
    assert_eq!(objects.capacity(), capacity);
    assert_eq!(objects[0].ref_count(), 1);
    assert!(first_weak.upgrade().is_some());
    assert!(second_weak.upgrade().is_none());
    assert!(third_weak.upgrade().is_none());

    // FR// Le tableau reste possédé et contient sa sentinelle, même après la libération des objets.
    // EN// The array remains owned and contains its sentinel even after the objects are freed.
    assert!(unsafe { (*allocation.add(objects.len())).is_null() });

    let replacement = glib::Object::new::<glib::Object>();
    let replacement_weak = replacement.downgrade();
    objects.push(replacement);
    assert_eq!(objects.len(), 2);
    assert_eq!(objects.as_ptr(), allocation);
    assert_eq!(objects.capacity(), capacity);
    assert!(unsafe { (*allocation.add(objects.len())).is_null() });

    drop(objects);
    assert!(first_weak.upgrade().is_none());
    assert!(replacement_weak.upgrade().is_none());
}

#[test]
fn ptr_slice_truncate_handles_empty_zero_and_repeated_calls() {
    let mut empty: glib::PtrSlice<glib::Object> = glib::PtrSlice::new();
    empty.truncate(0);
    empty.truncate(usize::MAX);
    assert!(empty.is_empty());
    assert_eq!(empty.capacity(), 0);

    let object = glib::Object::new::<glib::Object>();
    let weak = object.downgrade();
    let mut objects = glib::PtrSlice::from(vec![object]);
    let allocation = objects.as_ptr();
    let capacity = objects.capacity();
    objects.truncate(usize::MAX);
    assert_eq!(objects.len(), 1);
    objects.truncate(0);
    assert!(objects.is_empty());
    assert!(weak.upgrade().is_none());
    assert_eq!(objects.capacity(), capacity);

    // FR// Le pointeur sauvegardé désigne toujours le tableau alloué, dont le premier slot vaut NULL.
    // EN// The saved pointer still addresses the allocated array, whose first slot is NULL.
    assert!(unsafe { (*allocation).is_null() });
    objects.truncate(0);
    objects.push(glib::Object::new::<glib::Object>());
    assert_eq!(objects.as_ptr(), allocation);
    assert_eq!(objects.len(), 1);
}
