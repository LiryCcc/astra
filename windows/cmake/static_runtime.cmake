# Statically link the MSVC runtime (/MT) for release builds so vcruntime140*.dll
# is not required alongside the executable. Flutter engine DLLs remain dynamic.
if(MSVC)
  set(CMAKE_MSVC_RUNTIME_LIBRARY "MultiThreaded$<$<CONFIG:Debug>:Debug>")
endif()
