idf_component_register(SRCS "main.c" "ble_toilet.c" "asr_pro.c" "debug_console.c"
                            "app_config.c" "app_wifi.c" "web_server.c" "power_save.c"
                    INCLUDE_DIRS "."
                    EMBED_FILES "www/index.html"
                    REQUIRES bt driver nvs_flash console
                               esp_wifi esp_netif esp_event esp_http_server json lwip)
