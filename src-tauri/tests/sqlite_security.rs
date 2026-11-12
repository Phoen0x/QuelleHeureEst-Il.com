// FR// Exercices synthétiques inoffensifs : bibliothèque liée, chrono, transactions et WAL valide.
// EN// Harmless synthetic exercises: linked library, chrono, transactions and valid WAL.
use chrono::{NaiveDate, NaiveDateTime};
use rusqlite::{params, Connection};

#[test]
fn linked_sqlite_is_the_reviewed_fixed_source() {
    assert_eq!(rusqlite::version(), "3.54.1");
    assert_eq!(rusqlite::version_number(), 3_054_001);
    let db = Connection::open_in_memory().unwrap();
    let source: String = db
        .query_row("SELECT sqlite_source_id()", [], |r| r.get(0))
        .unwrap();
    assert_eq!(
        source,
        "2026-10-16 14:45:20 555e07ef33f69a0957d24d8e555b702464a131d6f1607f4c3c1e4551e8e6ca76"
    );
}

#[test]
fn chrono_and_unicode_values_round_trip() {
    let db = Connection::open_in_memory().unwrap();
    db.execute_batch("CREATE TABLE observations (at TEXT, label TEXT)")
        .unwrap();
    let at = NaiveDate::from_ymd_opt(2026, 11, 12)
        .unwrap()
        .and_hms_opt(12, 34, 56)
        .unwrap();
    db.execute(
        "INSERT INTO observations VALUES (?1, ?2)",
        params![at, "été — 東京"],
    )
    .unwrap();
    let result: (NaiveDateTime, String) = db
        .query_row("SELECT at,label FROM observations", [], |r| {
            Ok((r.get(0)?, r.get(1)?))
        })
        .unwrap();
    assert_eq!(result, (at, "été — 東京".into()));
}

#[test]
fn transaction_rollback_preserves_committed_data() {
    let mut db = Connection::open_in_memory().unwrap();
    db.execute_batch("CREATE TABLE items (id INTEGER PRIMARY KEY); INSERT INTO items VALUES(1)")
        .unwrap();
    {
        let tx = db.transaction().unwrap();
        tx.execute("INSERT INTO items VALUES(2)", []).unwrap();
        assert!(tx.execute("INSERT INTO items VALUES(1)", []).is_err());
        tx.rollback().unwrap();
    }
    assert_eq!(
        db.query_row("SELECT count(*) FROM items", [], |r| r.get::<_, i64>(0))
            .unwrap(),
        1
    );
    assert_eq!(
        db.query_row("PRAGMA integrity_check", [], |r| r.get::<_, String>(0))
            .unwrap(),
        "ok"
    );
}

#[test]
fn normal_wal_is_shared_and_reopened_without_data_loss() {
    let folder = std::env::temp_dir().join(format!("qh-sqlite-{}", uuid::Uuid::new_v4()));
    std::fs::create_dir(&folder).unwrap();
    let file = folder.join("synthetic.sqlite");
    {
        let db = Connection::open(&file).unwrap();
        db.execute_batch("PRAGMA page_size=4096; PRAGMA journal_mode=WAL; CREATE TABLE items (value TEXT); INSERT INTO items VALUES ('safe')").unwrap();
        assert_eq!(
            db.query_row("PRAGMA journal_mode", [], |r| r.get::<_, String>(0))
                .unwrap(),
            "wal"
        );
        let reader = Connection::open(&file).unwrap();
        assert_eq!(
            reader
                .query_row("SELECT value FROM items", [], |r| r.get::<_, String>(0))
                .unwrap(),
            "safe"
        );
    }
    {
        let reopened = Connection::open(&file).unwrap();
        assert_eq!(
            reopened
                .query_row("SELECT value FROM items", [], |r| r.get::<_, String>(0))
                .unwrap(),
            "safe"
        );
        assert_eq!(
            reopened
                .query_row("PRAGMA integrity_check", [], |r| r.get::<_, String>(0))
                .unwrap(),
            "ok"
        );
    }
    std::fs::remove_dir_all(folder).unwrap();
}
