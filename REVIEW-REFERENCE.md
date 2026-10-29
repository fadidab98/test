# Reviewer reference (keep separate from current incident evidence)

01 COMPILATION_FAILURE: Duplicate const declaration of hours in src/ledger.js causes a JavaScript syntax error when tests import application source.

02 DEPENDENCY_FAILURE: A dependency key containing spaces in package.json causes npm ci to fail with EINVALIDPACKAGENAME.

03 TEST_CONFIGURATION_FAILURE: The test runner explicitly selects test/absent-reporter.js, but the reporter file does not exist. Remove the invalid reporter configuration or supply the intended valid reporter.

04 UNKNOWN: Ordinary assertion mismatch, expected 99 and actual 5. Under taxonomy-v1 this is not TEST_CONFIGURATION_FAILURE. Investigation determines whether the expectation or implementation should change.

Suggested policy: 01/04 notify without automatic source/assertion edits. 02/03 may receive supported repair suggestions, followed by validation. This policy must be implemented and checked in the platform.
