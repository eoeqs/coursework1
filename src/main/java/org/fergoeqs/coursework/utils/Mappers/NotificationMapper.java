package org.fergoeqs.coursework.utils.Mappers;

import org.fergoeqs.coursework.dto.NotificationDTO;
import org.fergoeqs.coursework.models.Notification;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface NotificationMapper {
    @Mapping(target = "appUser", ignore = true)
    @Mapping(target = "dateTime", ignore = true)
    Notification fromDTO(NotificationDTO notificationDTO);
    @Mapping(target = "appUser", ignore = true)
    @Mapping(target = "dateTime", ignore = true)
    List<Notification> fromDTOs(List<NotificationDTO> notificationDTOs);

    @Mapping(source = "appUser.id", target = "appUser")
    NotificationDTO toDTO(Notification notification);
    @Mapping(source = "appUser.id", target = "appUser")
    List<NotificationDTO> toDTOs(List<Notification> notifications);
}
