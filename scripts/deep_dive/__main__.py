"""python -m scripts.deep_dive runs the Flash workflow; Deep Research is legacy opt-in."""
import sys

if "--legacy-deep-research" in sys.argv:
    sys.argv.remove("--legacy-deep-research")
    from scripts.deep_dive.generate import main

    main()
else:
    from scripts.deep_dive.flash_pipeline import main

    raise SystemExit(main())
