from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User

class UserAdmin(BaseUserAdmin):
    list_display = ('name', 'phone', 'role', 'location')
    list_filter = ('role',)
    fieldsets = (
        (None, {'fields': ('phone', 'password')}),
        ('Personal Info', {'fields': ('name', 'location', 'role')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('phone', 'name', 'location', 'role', 'password1', 'password2'),
        }),
    )
    search_fields = ('name', 'phone')
    ordering = ('name',)

admin.site.register(User, UserAdmin)
