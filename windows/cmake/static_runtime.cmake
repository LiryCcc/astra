# Statically link UCRT and MSVC runtime (/MT) for release builds so ucrtbase.dll,
# vcruntime140*.dll, etc. are not required alongside the executable.
# Flutter engine DLLs remain dynamic.
if(MSVC)
  set(CMAKE_MSVC_RUNTIME_LIBRARY "MultiThreaded$<$<CONFIG:Debug>:Debug>")
endif()
