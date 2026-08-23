# Statically link UCRT and MSVC runtime (/MT) for release builds so ucrtbase.dll,
# vcruntime140*.dll, etc. are not required alongside the executable.
# Flutter engine DLLs remain dynamic.
# See docs/technical/12-platform-toolchains.md
if(MSVC)
  set(CMAKE_MSVC_RUNTIME_LIBRARY "MultiThreaded$<$<CONFIG:Debug>:Debug>")
endif()

# Apply static UCRT (/MT) to a CMake target. Use for all Windows native targets.
function(APPLY_STATIC_UCRT_RUNTIME TARGET)
  if(MSVC)
    set_property(
      TARGET ${TARGET}
      PROPERTY MSVC_RUNTIME_LIBRARY "MultiThreaded$<$<CONFIG:Debug>:Debug>"
    )
  endif()
endfunction()
